const Queue = require("bull")
const redisClient = require("../config/redis")
const fiveApiService = require("../services/fiveApiService")
const emailService = require("../utils/emailService")
const logger = require("../utils/logger")
const db = require("../config/database")

// Create job queues
const orderQueue = new Queue("order processing", {
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
  },
})

const statusCheckQueue = new Queue("status check", {
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
  },
})

// Process new orders
orderQueue.process("process-order", async (job) => {
  const { orderId } = job.data

  try {
    logger.info("Processing order", { orderId })

    // Get order details
    const order = await db("orders").where({ id: orderId }).first()
    if (!order) {
      throw new Error("Order not found")
    }

    // Log order processing start
    await db("order_logs").insert({
      order_id: orderId,
      event_type: "submitted_to_api",
      message: "Order submitted to Five API",
    })

    // Submit to Five API
    const apiResult = await fiveApiService.createOrder({
      platform: order.platform,
      serviceType: order.service_type,
      targetUrl: order.target_url,
      quantity: order.quantity,
    })

    // Update order with Five API response
    await db("orders")
      .where({ id: orderId })
      .update({
        five_api_order_id: apiResult.orderId,
        status: "processing",
        started_at: new Date(),
        five_api_response: JSON.stringify(apiResult),
      })

    // Fetch user email for confirmation
    const orderWithEmail = await db("orders")
      .leftJoin("users", "orders.user_id", "users.id")
      .select("orders.*", "users.email")
      .where("orders.id", orderId)
      .first();
    if (orderWithEmail && orderWithEmail.email) {
      await emailService.sendOrderConfirmationEmail(orderWithEmail.email, orderWithEmail);
    }

    // Log API response
    await db("order_logs").insert({
      order_id: orderId,
      event_type: "api_response_received",
      message: "Received response from Five API",
      metadata: JSON.stringify(apiResult),
    })

    // Schedule status check in 2 minutes
    await statusCheckQueue.add(
      "check-order-status",
      { orderId, fiveApiOrderId: apiResult.orderId },
      { delay: 2 * 60 * 1000 }, // 2 minutes
    )

    logger.info("Order processed successfully", { orderId, fiveApiOrderId: apiResult.orderId })
  } catch (error) {
    logger.error("Order processing failed", { orderId, error: error.message })

    // Update order status to failed
    await db("orders").where({ id: orderId }).update({ status: "failed" })

    // Log failure
    await db("order_logs").insert({
      order_id: orderId,
      event_type: "failed",
      message: `Order processing failed: ${error.message}`,
      metadata: JSON.stringify({ error: error.stack }),
    })

    // Send alert to developers
    const order = await db("orders").where({ id: orderId }).first()
    await emailService.sendOrderFailureAlert(orderId, order?.order_number, error)

    throw error
  }
})

// Check order status
statusCheckQueue.process("check-order-status", async (job) => {
  const { orderId, fiveApiOrderId } = job.data

  try {
    logger.info("Checking order status", { orderId, fiveApiOrderId })

    // Get order to access original quantity
    const order = await db("orders").where({ id: orderId }).first()
    if (!order) {
      throw new Error("Order not found")
    }

    // Get current status from Five API
    const statusResponse = await fiveApiService.getOrderStatus(fiveApiOrderId)

    // Handle error responses
    if (statusResponse.error) {
      logger.warn("Error in status response", {
        orderId,
        fiveApiOrderId,
        error: statusResponse.error,
      })
      // Schedule retry in 15 minutes
      await statusCheckQueue.add("check-order-status", { orderId, fiveApiOrderId }, { delay: 15 * 60 * 1000 })
      return
    }

    // Update order based on status
    const updateData = {
      five_api_response: JSON.stringify(statusResponse),
      updated_at: new Date(),
    }

    let shouldScheduleNextCheck = false
    let nextCheckDelay = 5 * 60 * 1000 // 5 minutes default
    const orderQuantity = order.quantity
    const remains = statusResponse.remains ? parseInt(statusResponse.remains) : 0

    switch (statusResponse.status) {
      case "Completed":
        updateData.status = "completed"
        updateData.completed_at = new Date()
        updateData.delivered_quantity = Math.max(0, orderQuantity - remains)
        updateData.completion_percentage = 100
        break

      case "Partial":
        updateData.status = "partial"
        updateData.delivered_quantity = Math.max(0, orderQuantity - remains)
        updateData.completion_percentage = remains > 0
          ? ((orderQuantity - remains) / orderQuantity) * 100
          : 0
        shouldScheduleNextCheck = true
        nextCheckDelay = 10 * 60 * 1000 // Check every 10 minutes for partial orders
        break

      case "Processing":
      case "In progress":
        updateData.status = "in_progress"
        if (!order.started_at) {
          updateData.started_at = new Date()
        }
        if (statusResponse.start_count) {
          const startCount = parseInt(statusResponse.start_count)
          updateData.delivered_quantity = Math.max(0, orderQuantity - remains)
          updateData.completion_percentage = remains > 0
            ? ((orderQuantity - remains) / orderQuantity) * 100
            : 0
        }
        shouldScheduleNextCheck = true
        nextCheckDelay = 10 * 60 * 1000 // Check every 10 minutes for in-progress orders
        break

      case "Pending":
        updateData.status = "processing"
        shouldScheduleNextCheck = true
        nextCheckDelay = 5 * 60 * 1000 // Check every 5 minutes for pending orders
        break

      case "Canceled":
      case "Cancelled":
        updateData.status = "cancelled"
        break

      default:
        logger.warn("Unknown order status from Five API", {
          orderId,
          fiveApiOrderId,
          status: statusResponse.status,
        })
        shouldScheduleNextCheck = true
    }

    // Update order in database
    await db("orders").where({ id: orderId }).update(updateData)

    // Log status update
    await db("order_logs").insert({
      order_id: orderId,
      event_type: "status_updated",
      message: `Order status updated to: ${updateData.status}`,
      metadata: JSON.stringify(statusResponse),
      created_at: new Date(),
    })

    // Schedule next check if needed
    if (shouldScheduleNextCheck) {
      await statusCheckQueue.add("check-order-status", { orderId, fiveApiOrderId }, { delay: nextCheckDelay })
    }

    logger.info("Order status updated", {
      orderId,
      fiveApiOrderId,
      status: updateData.status,
    })
  } catch (error) {
    logger.error("Status check failed", { orderId, fiveApiOrderId, error: error.message })

    // Schedule retry in 15 minutes
    await statusCheckQueue.add("check-order-status", { orderId, fiveApiOrderId }, { delay: 15 * 60 * 1000 })
  }
})

// Error handling for queues
orderQueue.on("failed", (job, err) => {
  logger.error("Order processing job failed", {
    jobId: job.id,
    data: job.data,
    error: err.message,
  })
})

statusCheckQueue.on("failed", (job, err) => {
  logger.error("Status check job failed", {
    jobId: job.id,
    data: job.data,
    error: err.message,
  })
})

module.exports = {
  orderQueue,
  statusCheckQueue,
}

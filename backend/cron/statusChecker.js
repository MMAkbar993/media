const cron = require("node-cron")
const db = require("../config/database")
const fiveApiService = require("../services/fiveApiService")
const logger = require("../utils/logger")

/**
 * Helper function to map Five API status to our internal status
 */
function mapFiveApiStatusToInternal(fiveApiStatus, statusResponse, orderQuantity) {
  const updateData = {
    five_api_response: JSON.stringify(statusResponse),
    updated_at: new Date(),
  }

  switch (fiveApiStatus) {
    case "Completed":
      updateData.status = "completed"
      updateData.completed_at = new Date()
      const remains = statusResponse.remains ? parseInt(statusResponse.remains) : 0
      updateData.delivered_quantity = Math.max(0, orderQuantity - remains)
      updateData.completion_percentage = 100
      break

    case "Partial":
      updateData.status = "partial"
      const partialStartCount = statusResponse.start_count ? parseInt(statusResponse.start_count) : 0
      const partialRemains = statusResponse.remains ? parseInt(statusResponse.remains) : orderQuantity
      updateData.delivered_quantity = Math.max(0, orderQuantity - partialRemains)
      updateData.completion_percentage = partialRemains > 0
        ? ((orderQuantity - partialRemains) / orderQuantity) * 100
        : 0
      break

    case "Processing":
    case "In progress":
      updateData.status = "in_progress"
      if (statusResponse.start_count) {
        const inProgressStartCount = parseInt(statusResponse.start_count)
        const inProgressRemains = statusResponse.remains ? parseInt(statusResponse.remains) : orderQuantity
        updateData.delivered_quantity = Math.max(0, orderQuantity - inProgressRemains)
        updateData.completion_percentage = inProgressRemains > 0
          ? ((orderQuantity - inProgressRemains) / orderQuantity) * 100
          : 0
      }
      break

    case "Pending":
      updateData.status = "processing"
      break

    case "Canceled":
    case "Cancelled":
      updateData.status = "cancelled"
      break

    default:
      logger.warn("Unknown status from Five API", { status: fiveApiStatus })
      // Keep current status but update the response
  }

  return updateData
}

/**
 * Check all active orders (processing, in_progress, partial) for status updates
 * Runs every 10 minutes
 */
const activeOrderChecker = cron.schedule(
  "*/10 * * * *",
  async () => {
    try {
      logger.info("Running active order status check")

      // Find all active orders that have a Five API order ID
      const activeOrders = await db("orders")
        .whereIn("status", ["processing", "in_progress", "partial"])
        .whereNotNull("five_api_order_id")
        .select("id", "order_number", "five_api_order_id", "quantity", "status")

      if (activeOrders.length === 0) {
        logger.info("No active orders to check")
        return
      }

      logger.info(`Checking status for ${activeOrders.length} active orders`)

      // Process orders in batches of 100 (API limit)
      const batchSize = 100
      for (let i = 0; i < activeOrders.length; i += batchSize) {
        const batch = activeOrders.slice(i, i + batchSize)
        const orderIdMap = new Map() // Map Five API order ID to our order object

        for (const order of batch) {
          orderIdMap.set(order.five_api_order_id, order)
        }

        try {
          // Get statuses for all orders in this batch
          const fiveApiOrderIds = batch.map((o) => o.five_api_order_id)
          const statusResponses = await fiveApiService.getMultipleOrderStatuses(fiveApiOrderIds)

          // Update each order based on its status
          for (const [fiveApiOrderId, statusResponse] of Object.entries(statusResponses)) {
            const order = orderIdMap.get(fiveApiOrderId)

            if (!order) {
              logger.warn("Order not found in map", { fiveApiOrderId })
              continue
            }

            // Handle error responses
            if (statusResponse.error) {
              logger.warn("Error in status response", {
                orderId: order.id,
                fiveApiOrderId,
                error: statusResponse.error,
              })
              continue
            }

            try {
              const status = statusResponse.status
              const updateData = mapFiveApiStatusToInternal(status, statusResponse, order.quantity)

              // Set started_at if not already set and order is in progress
              if (updateData.status === "in_progress" && !updateData.started_at) {
                updateData.started_at = new Date()
              }

              await db("orders").where({ id: order.id }).update(updateData)

              // Log the update
              await db("order_logs").insert({
                order_id: order.id,
                event_type: "status_updated",
                message: `Order status updated to: ${updateData.status} via cron job`,
                metadata: JSON.stringify(statusResponse),
                created_at: new Date(),
              })

              logger.info("Order status updated via cron", {
                orderId: order.id,
                orderNumber: order.order_number,
                fiveApiOrderId,
                oldStatus: order.status,
                newStatus: updateData.status,
              })
            } catch (updateError) {
              logger.error("Failed to update order", {
                orderId: order.id,
                fiveApiOrderId,
                error: updateError.message,
              })
            }
          }
        } catch (batchError) {
          logger.error("Failed to process batch", {
            batchStart: i,
            batchSize: batch.length,
            error: batchError.message,
          })

          // Fallback: try individual requests for this batch
          for (const order of batch) {
            try {
              const statusResponse = await fiveApiService.getOrderStatus(order.five_api_order_id)
              const status = statusResponse.status
              const updateData = mapFiveApiStatusToInternal(status, statusResponse, order.quantity)

              if (updateData.status === "in_progress" && !updateData.started_at) {
                updateData.started_at = new Date()
              }

              await db("orders").where({ id: order.id }).update(updateData)

              await db("order_logs").insert({
                order_id: order.id,
                event_type: "status_updated",
                message: `Order status updated to: ${updateData.status} via cron job (fallback)`,
                metadata: JSON.stringify(statusResponse),
                created_at: new Date(),
              })
            } catch (individualError) {
              logger.error("Failed to update order in fallback", {
                orderId: order.id,
                error: individualError.message,
              })
            }
          }
        }
      }

      logger.info(`Active order check completed. Processed ${activeOrders.length} orders`)
    } catch (error) {
      logger.error("Active order checker failed:", error)
    }
  },
  {
    scheduled: false,
  },
)

// Check for stale orders (orders that haven't been updated in a while)
// This is a backup check for orders that might have been missed
const staleOrderChecker = cron.schedule(
  "*/30 * * * *",
  async () => {
    try {
      logger.info("Running stale order check")

      // Find orders that are in processing/in_progress state for more than 2 hours
      const staleOrders = await db("orders")
        .whereIn("status", ["processing", "in_progress"])
        .where("updated_at", "<", new Date(Date.now() - 2 * 60 * 60 * 1000))
        .whereNotNull("five_api_order_id")

      if (staleOrders.length === 0) {
        logger.info("No stale orders found")
        return
      }

      logger.info(`Found ${staleOrders.length} stale orders`)

      // Process in batches
      const batchSize = 100
      for (let i = 0; i < staleOrders.length; i += batchSize) {
        const batch = staleOrders.slice(i, i + batchSize)
        const orderIdMap = new Map()

        for (const order of batch) {
          orderIdMap.set(order.five_api_order_id, order)
        }

        try {
          const fiveApiOrderIds = batch.map((o) => o.five_api_order_id)
          const statusResponses = await fiveApiService.getMultipleOrderStatuses(fiveApiOrderIds)

          for (const [fiveApiOrderId, statusResponse] of Object.entries(statusResponses)) {
            const order = orderIdMap.get(fiveApiOrderId)

            if (!order || statusResponse.error) {
              continue
            }

            const status = statusResponse.status
            const updateData = mapFiveApiStatusToInternal(status, statusResponse, order.quantity)

            await db("orders").where({ id: order.id }).update(updateData)

            await db("order_logs").insert({
              order_id: order.id,
              event_type: "status_updated",
              message: `Stale order status updated to: ${updateData.status}`,
              metadata: JSON.stringify(statusResponse),
              created_at: new Date(),
            })

            logger.info("Stale order updated", {
              orderId: order.id,
              orderNumber: order.order_number,
              newStatus: updateData.status,
            })
          }
        } catch (batchError) {
          logger.error("Failed to process stale batch", {
            error: batchError.message,
          })
        }
      }

      logger.info(`Stale order check completed. Processed ${staleOrders.length} orders`)
    } catch (error) {
      logger.error("Stale order checker failed:", error)
    }
  },
  {
    scheduled: false,
  },
)

// Validate service IDs daily
const serviceIdValidator = cron.schedule(
  "0 2 * * *",
  async () => {
    try {
      logger.info("Running daily service ID validation")
      await fiveApiService.validateServiceIds()
      logger.info("Service ID validation completed")
    } catch (error) {
      logger.error("Service ID validation failed:", error)
    }
  },
  {
    scheduled: false,
  },
)

// Clean up old logs (keep only last 30 days)
const logCleaner = cron.schedule(
  "0 3 * * 0",
  async () => {
    try {
      logger.info("Running weekly log cleanup")

      const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago

      const deletedCount = await db("order_logs").where("created_at", "<", cutoffDate).del()

      logger.info(`Log cleanup completed. Deleted ${deletedCount} old log entries`)
    } catch (error) {
      logger.error("Log cleanup failed:", error)
    }
  },
  {
    scheduled: false,
  },
)

module.exports = {
  activeOrderChecker,
  staleOrderChecker,
  serviceIdValidator,
  logCleaner,

  startAll() {
    activeOrderChecker.start()
    staleOrderChecker.start()
    serviceIdValidator.start()
    logCleaner.start()
    logger.info("All cron jobs started")
  },

  stopAll() {
    activeOrderChecker.stop()
    staleOrderChecker.stop()
    serviceIdValidator.stop()
    logCleaner.stop()
    logger.info("All cron jobs stopped")
  },
}

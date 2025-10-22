const cron = require("node-cron")
const db = require("../config/database")
const fiveApiService = require("../services/fiveApiService")
const logger = require("../utils/logger")

// Check for stale orders (orders that haven't been updated in a while)
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

      for (const order of staleOrders) {
        try {
          // Check status with Five API
          const statusResponse = await fiveApiService.getOrderStatus(order.five_api_order_id)

          // Update order based on current status
          const updateData = {
            five_api_response: JSON.stringify(statusResponse),
            updated_at: new Date(),
          }

          switch (statusResponse.status) {
            case "Completed":
              updateData.status = "completed"
              updateData.completed_at = new Date()
              updateData.delivered_quantity = statusResponse.remains
                ? Number.parseInt(statusResponse.quantity) - Number.parseInt(statusResponse.remains)
                : Number.parseInt(statusResponse.quantity)
              updateData.completion_percentage = 100
              break

            case "Partial":
              updateData.status = "partial"
              updateData.delivered_quantity = statusResponse.remains
                ? Number.parseInt(statusResponse.quantity) - Number.parseInt(statusResponse.remains)
                : 0
              updateData.completion_percentage = statusResponse.remains
                ? ((Number.parseInt(statusResponse.quantity) - Number.parseInt(statusResponse.remains)) /
                    Number.parseInt(statusResponse.quantity)) *
                  100
                : 0
              break

            case "Canceled":
              updateData.status = "cancelled"
              break
          }

          await db("orders").where({ id: order.id }).update(updateData)

          // Log the update
          await db("order_logs").insert({
            order_id: order.id,
            event_type: "status_updated",
            message: `Stale order status updated to: ${updateData.status}`,
            metadata: JSON.stringify(statusResponse),
          })

          logger.info("Stale order updated", {
            orderId: order.id,
            orderNumber: order.order_number,
            newStatus: updateData.status,
          })
        } catch (error) {
          logger.error("Failed to update stale order", {
            orderId: order.id,
            error: error.message,
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
  staleOrderChecker,
  serviceIdValidator,
  logCleaner,

  startAll() {
    staleOrderChecker.start()
    serviceIdValidator.start()
    logCleaner.start()
    logger.info("All cron jobs started")
  },

  stopAll() {
    staleOrderChecker.stop()
    serviceIdValidator.stop()
    logCleaner.stop()
    logger.info("All cron jobs stopped")
  },
}

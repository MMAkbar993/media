const express = require("express")
const router = express.Router()
const db = require("../config/database")
const logger = require("../utils/logger")

// Get all orders with client information
router.get("/orders", async (req, res) => {
  try {
    const { status, platform, serviceType, page = 1, limit = 50, search } = req.query
    const offset = (parseInt(page) - 1) * parseInt(limit)

    let query = db("orders")
      .leftJoin("users", "orders.user_id", "users.id")
      .select(
        "orders.*",
        "users.email",
        "users.first_name",
        "users.last_name",
        "users.phone",
        "users.created_at as user_created_at",
        "users.status as user_status"
      )
      .orderBy("orders.created_at", "desc")

    // Apply filters
    if (status) {
      query = query.where("orders.status", status)
    }
    if (platform) {
      query = query.where("orders.platform", platform)
    }
    if (serviceType) {
      query = query.where("orders.service_type", serviceType)
    }
    if (search) {
      query = query.where((builder) => {
        builder
          .where("orders.order_number", "like", `%${search}%`)
          .orWhere("users.email", "like", `%${search}%`)
          .orWhere("orders.target_url", "like", `%${search}%`)
      })
    }

    // Get total count for pagination
    const countQuery = db("orders")
      .leftJoin("users", "orders.user_id", "users.id")
    
    if (status) {
      countQuery.where("orders.status", status)
    }
    if (platform) {
      countQuery.where("orders.platform", platform)
    }
    if (serviceType) {
      countQuery.where("orders.service_type", serviceType)
    }
    if (search) {
      countQuery.where((builder) => {
        builder
          .where("orders.order_number", "like", `%${search}%`)
          .orWhere("users.email", "like", `%${search}%`)
          .orWhere("orders.target_url", "like", `%${search}%`)
      })
    }
    
    const [{ total }] = await countQuery.count("* as total")
    const totalCount = parseInt(total) || 0

    // Get paginated results
    const orders = await query.limit(parseInt(limit)).offset(offset)

    // Get order logs for each order
    const orderIds = orders.map((order) => order.id)
    const logs = await db("order_logs")
      .whereIn("order_id", orderIds)
      .orderBy("created_at", "desc")

    // Group logs by order_id
    const logsByOrder = {}
    logs.forEach((log) => {
      if (!logsByOrder[log.order_id]) {
        logsByOrder[log.order_id] = []
      }
      logsByOrder[log.order_id].push({
        event: log.event_type,
        message: log.message,
        timestamp: log.created_at,
      })
    })

    // Attach logs to orders
    const ordersWithLogs = orders.map((order) => ({
      ...order,
      logs: logsByOrder[order.id] || [],
    }))

    res.json({
      success: true,
      orders: ordersWithLogs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        totalPages: Math.ceil(totalCount / parseInt(limit)),
      },
    })
  } catch (error) {
    logger.error("Failed to fetch admin orders", {
      error: error.message,
      stack: error.stack,
      service: "social-media-backend",
    })

    res.status(500).json({
      success: false,
      error: "Failed to fetch orders",
    })
  }
})

// Get all clients with their order statistics
router.get("/clients", async (req, res) => {
  try {
    const { page = 1, limit = 50, search } = req.query
    const offset = (parseInt(page) - 1) * parseInt(limit)

    let query = db("users").select(
      "users.*",
      db.raw("COUNT(orders.id) as total_orders"),
      db.raw("SUM(CASE WHEN orders.status = 'completed' THEN 1 ELSE 0 END) as completed_orders"),
      db.raw("SUM(orders.amount) as total_spent"),
      db.raw("MAX(orders.created_at) as last_order_date")
    )
    .leftJoin("orders", "users.id", "orders.user_id")
    .groupBy("users.id")
    .orderBy("last_order_date", "desc")

    if (search) {
      query = query.where((builder) => {
        builder
          .where("users.email", "like", `%${search}%`)
          .orWhere("users.first_name", "like", `%${search}%`)
          .orWhere("users.last_name", "like", `%${search}%`)
      })
    }

    // Get total count - use a subquery approach
    let baseQuery = db("users")
    if (search) {
      baseQuery = baseQuery.where((builder) => {
        builder
          .where("users.email", "like", `%${search}%`)
          .orWhere("users.first_name", "like", `%${search}%`)
          .orWhere("users.last_name", "like", `%${search}%`)
      })
    }
    
    const countResult = await baseQuery.count("* as total").first()
    const totalCount = parseInt(countResult?.total) || 0

    // Get paginated results
    const clients = await query.limit(parseInt(limit)).offset(offset)

    res.json({
      success: true,
      clients: clients.map((client) => ({
        ...client,
        total_orders: parseInt(client.total_orders) || 0,
        completed_orders: parseInt(client.completed_orders) || 0,
        total_spent: parseFloat(client.total_spent) || 0,
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        totalPages: Math.ceil(totalCount / parseInt(limit)),
      },
    })
  } catch (error) {
    logger.error("Failed to fetch admin clients", {
      error: error.message,
      stack: error.stack,
      service: "social-media-backend",
    })

    res.status(500).json({
      success: false,
      error: "Failed to fetch clients",
    })
  }
})

// Get client details with all orders
router.get("/clients/:userId", async (req, res) => {
  try {
    const { userId } = req.params

    // Get client information
    const client = await db("users").where("id", userId).first()

    if (!client) {
      return res.status(404).json({
        success: false,
        error: "Client not found",
      })
    }

    // Get all orders for this client
    const orders = await db("orders")
      .where("user_id", userId)
      .orderBy("created_at", "desc")

    // Get order logs
    const orderIds = orders.map((order) => order.id)
    const logs = await db("order_logs")
      .whereIn("order_id", orderIds)
      .orderBy("created_at", "desc")

    const logsByOrder = {}
    logs.forEach((log) => {
      if (!logsByOrder[log.order_id]) {
        logsByOrder[log.order_id] = []
      }
      logsByOrder[log.order_id].push({
        event: log.event_type,
        message: log.message,
        timestamp: log.created_at,
      })
    })

    const ordersWithLogs = orders.map((order) => ({
      ...order,
      logs: logsByOrder[order.id] || [],
    }))

    res.json({
      success: true,
      client: {
        ...client,
        orders: ordersWithLogs,
        total_orders: orders.length,
        total_spent: orders.reduce((sum, order) => sum + parseFloat(order.amount || 0), 0),
      },
    })
  } catch (error) {
    logger.error("Failed to fetch client details", {
      userId: req.params.userId,
      error: error.message,
      service: "social-media-backend",
    })

    res.status(500).json({
      success: false,
      error: "Failed to fetch client details",
    })
  }
})

// Update order status (admin version)
router.patch("/orders/:orderId/status", async (req, res) => {
  try {
    const { orderId } = req.params
    const { status, message, deliveredQuantity, completionPercentage } = req.body

    const validStatuses = [
      "pending_payment",
      "payment_confirmed",
      "processing",
      "in_progress",
      "completed",
      "partial",
      "cancelled",
      "refunded",
      "failed",
    ]

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status",
        validStatuses,
      })
    }

    const trx = await db.transaction()

    try {
      const updateData = {
        status,
        updated_at: new Date(),
      }

      if (deliveredQuantity !== undefined) {
        updateData.delivered_quantity = deliveredQuantity
      }
      if (completionPercentage !== undefined) {
        updateData.completion_percentage = completionPercentage
      }
      if (status === "in_progress" && !updateData.started_at) {
        updateData.started_at = new Date()
      }
      if (status === "completed" && !updateData.completed_at) {
        updateData.completed_at = new Date()
      }

      const updated = await trx("orders").where("id", orderId).update(updateData)

      if (updated === 0) {
        await trx.rollback()
        return res.status(404).json({
          success: false,
          error: "Order not found",
        })
      }

      // Log status change
      await trx("order_logs").insert({
        order_id: orderId,
        event_type: "status_changed",
        message: message || `Status changed to ${status} by admin`,
        created_at: new Date(),
      })

      await trx.commit()

      logger.info("Admin updated order status", {
        orderId,
        status,
        service: "social-media-backend",
      })

      res.json({
        success: true,
        message: "Order status updated successfully",
      })
    } catch (dbError) {
      await trx.rollback()
      throw dbError
    }
  } catch (error) {
    logger.error("Failed to update order status", {
      orderId: req.params.orderId,
      error: error.message,
      service: "social-media-backend",
    })

    res.status(500).json({
      success: false,
      error: "Failed to update order status",
    })
  }
})

// Get admin dashboard statistics
router.get("/dashboard/stats", async (req, res) => {
  try {
    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
      totalClients,
      ordersByStatus,
      ordersByPlatform,
    ] = await Promise.all([
      db("orders").count("* as count").first(),
      db("orders").where("status", "pending_payment").count("* as count").first(),
      db("orders").where("status", "completed").count("* as count").first(),
      db("orders").where("status", "completed").sum("amount as total").first(),
      db("users").count("* as count").first(),
      db("orders").select("status").count("* as count").groupBy("status"),
      db("orders").select("platform").count("* as count").groupBy("platform"),
    ])

    res.json({
      success: true,
      stats: {
        totalOrders: parseInt(totalOrders.count) || 0,
        pendingOrders: parseInt(pendingOrders.count) || 0,
        completedOrders: parseInt(completedOrders.count) || 0,
        totalRevenue: parseFloat(totalRevenue.total) || 0,
        totalClients: parseInt(totalClients.count) || 0,
        ordersByStatus: ordersByStatus.reduce((acc, item) => {
          acc[item.status] = parseInt(item.count) || 0
          return acc
        }, {}),
        ordersByPlatform: ordersByPlatform.reduce((acc, item) => {
          acc[item.platform] = parseInt(item.count) || 0
          return acc
        }, {}),
      },
    })
  } catch (error) {
    logger.error("Failed to fetch dashboard stats", {
      error: error.message,
      service: "social-media-backend",
    })

    res.status(500).json({
      success: false,
      error: "Failed to fetch dashboard statistics",
    })
  }
})

module.exports = router


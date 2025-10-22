const express = require("express")
const router = express.Router()
const db = require("../config/database")
const { v4: uuidv4 } = require("uuid")
const logger = require("../utils/logger")
const bcrypt = require("bcryptjs")
const emailService = require("../utils/emailService")

// Create a new order
router.post("/", async (req, res) => {
  try {
    const { email, platform, serviceType, quantity, targetUrl, price, packageTitle, quality } = req.body

    // Validate required fields
    if (!email || !platform || !serviceType || !quantity || !targetUrl) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        required: ["email", "platform", "serviceType", "quantity", "targetUrl"],
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format",
      })
    }

    // Validate platform
    if (!["instagram", "tiktok"].includes(platform.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: "Platform must be 'instagram' or 'tiktok'",
      })
    }

    // Validate service type
    const validServices = {
      instagram: ["likes", "followers", "views", "comments"],
      tiktok: ["likes", "followers", "views"],
    }

    if (!validServices[platform.toLowerCase()].includes(serviceType.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: `Invalid service type for ${platform}`,
        validServices: validServices[platform.toLowerCase()],
      })
    }

    // Validate quantity
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: "Quantity must be a positive integer",
      })
    }

    // Determine quality multiplier
    let qualityMultiplier = 1
    if (quality === "premium") {
      qualityMultiplier = 1.2 // Example: 20% more for premium
    }

    // Generate order ID and order number
    const orderId = uuidv4()
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`

    // Calculate price if not provided
    const finalPrice = price || calculatePrice(platform, serviceType, quantity, qualityMultiplier)

    // Start transaction
    const trx = await db.transaction()

    try {
      // First, check if we need to create a user record
      let userId = null

      // Check if user exists
      const existingUser = await trx("users").where("email", email.toLowerCase()).first()

      if (existingUser) {
        userId = existingUser.id
      } else {
        // Create new user with a guest password hash
        const guestPasswordHash = await bcrypt.hash(`guest_${Date.now()}`, 10)
        const newUserId = uuidv4()

        await trx("users").insert({
          id: newUserId,
          email: email.toLowerCase(),
          password_hash: guestPasswordHash,
          first_name: null,
          last_name: null,
          phone: null,
          status: "active",
          failed_login_attempts: 0,
          last_login_attempt: null,
          email_verified_at: null,
          created_at: new Date(),
          updated_at: new Date(),
        })

        userId = newUserId
      }

      // Insert order using the correct column names from the migration
      await trx("orders").insert({
        id: orderId,
        order_number: orderNumber,
        user_id: userId,
        platform: platform.toLowerCase(),
        service_type: serviceType.toLowerCase(),
        target_url: targetUrl,
        quantity: quantity,
        amount: finalPrice,
        currency: "USD",
        status: "pending_payment",
        five_api_service_id: getServiceId(platform, serviceType),
        five_api_service_name: `${platform} ${serviceType}`,
        completion_percentage: 0,
        delivered_quantity: 0,
        created_at: new Date(),
        updated_at: new Date(),
      })

      // Log order creation
      await trx("order_logs").insert({
        order_id: orderId,
        event_type: "created",
        message: `Order created for ${quantity} ${serviceType} on ${platform}`,
        created_at: new Date(),
      })

      await trx.commit()

      logger.info("Order created successfully", {
        orderId,
        orderNumber,
        email,
        platform,
        serviceType,
        quantity,
        amount: finalPrice,
        service: "social-media-backend",
      })

        /// Send admin notification with order details and customer email
        ; (async () => {
          try {
            await emailService.sendNewOrderNotification(email.toLowerCase(), {
              orderId,
              orderNumber,
              platform: platform.toLowerCase(),
              serviceType: serviceType.toLowerCase(),
              quantity,
              amount: finalPrice,
              currency: "USD",
              targetUrl,
            })
          } catch (e) {
            logger.warn("Non-blocking: failed to send admin order email", { error: e.message })
          }
        })()

        // Send order confirmation email to the user
        ; (async () => {
          try {
            await emailService.sendOrderConfirmationEmail(email.toLowerCase(), {
              orderNumber,
              platform,
              serviceType,
              quantity,
              amount: finalPrice,
              currency: "USD",
              trackUrl: `${process.env.FRONTEND_URL}/track/${email}`,
              createdAt: new Date().toLocaleString(),
              subject: `Your ${platform} ${serviceType} order confirmation`,
            })
          } catch (e) {
            logger.warn("Non-blocking: failed to send user confirmation email", { error: e.message })
          }
        })()

        // Send order confirmation email to the user
        ; (async () => {
          try {
            await emailService.sendOrderConfirmationEmail(email.toLowerCase(), {
              orderNumber,
              platform,
              serviceType,
              quantity,
              amount: finalPrice,
              currency: "USD",
              trackUrl: `${process.env.FRONTEND_URL}/track/${email}`,
              createdAt: new Date().toLocaleString(),
              subject: `Your ${platform} ${serviceType} order confirmation`,
            })
          } catch (e) {
            logger.warn("Non-blocking: failed to send user confirmation email", { error: e.message })
          }
        })()


      res.status(201).json({
        success: true,
        orderId,
        orderNumber,
        amount: finalPrice,
        currency: "USD",
        status: "pending_payment",
        message: "Order created successfully",
      })
    } catch (dbError) {
      await trx.rollback()
      throw dbError
    }
  } catch (error) {
    logger.error("Order creation failed", {
      body: req.body,
      error: error.message,
      stack: error.stack,
      service: "social-media-backend",
    })

    res.status(500).json({
      success: false,
      error: "Failed to create order",
      message: "Please try again later",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// Get order by ID or order number
router.get("/:identifier", async (req, res) => {
  try {
    const { identifier } = req.params

    // Check if identifier is UUID (order ID) or order number
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier)

    const order = await db("orders")
      .leftJoin("users", "orders.user_id", "users.id")
      .select("orders.*", "users.email")
      .where(isUUID ? "orders.id" : "orders.order_number", identifier)
      .first()

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      })
    }

    // Get order logs
    const logs = await db("order_logs").where("order_id", order.id).orderBy("created_at", "desc")

    res.json({
      success: true,
      order: {
        ...order,
        logs: logs.map((log) => ({
          event: log.event_type,
          message: log.message,
          timestamp: log.created_at,
        })),
      },
    })
  } catch (error) {
    logger.error("Failed to fetch order", {
      identifier: req.params.identifier,
      error: error.message,
      service: "social-media-backend",
    })

    res.status(500).json({
      success: false,
      error: "Failed to fetch order",
    })
  }
})

// Update order status
router.patch("/:orderId/status", async (req, res) => {
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
      // Prepare update data
      const updateData = {
        status,
        updated_at: new Date(),
      }

      // Add optional fields if provided
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

      // Update order status
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
        message: message || `Status changed to ${status}`,
        created_at: new Date(),
      })

      await trx.commit()

      logger.info("Order status updated", {
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

// Get orders by email
router.get("/track/:email", async (req, res) => {
  try {
    const { email } = req.params

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Valid email is required",
      })
    }

    const orders = await db("orders")
      .leftJoin("users", "orders.user_id", "users.id")
      .select("orders.*", "users.email")
      .where("users.email", email.toLowerCase())
      .orderBy("orders.created_at", "desc")
      .limit(10)

    res.json({
      success: true,
      orders,
    })
  } catch (error) {
    logger.error("Failed to fetch orders by email", {
      email: req.params.email,
      error: error.message,
      service: "social-media-backend",
    })

    res.status(500).json({
      success: false,
      error: "Failed to fetch orders",
    })
  }
})

// Helper function to calculate price
function calculatePrice(platform, serviceType, quantity, qualityMultiplier = 1) {
  const basePrices = {
    instagram: {
      likes: 0.005, // $0.005 per like
      followers: 0.01, // $0.01 per follower
      views: 0.001, // $0.001 per view
      comments: 0.02, // $0.02 per comment
    },
    tiktok: {
      likes: 0.006, // $0.006 per like
      followers: 0.012, // $0.012 per follower
      views: 0.0015, // $0.0015 per view
    },
  }

  const basePrice = basePrices[platform]?.[serviceType] || 0.01
  let totalPrice = basePrice * quantity

  // Apply quality multiplier
  totalPrice *= qualityMultiplier

  // Minimum order of $1
  return Math.max(1, Math.round(totalPrice * 100) / 100)
}

// Helper function to get service ID for Five API
function getServiceId(platform, serviceType) {
  const serviceMap = {
    "instagram-likes": "1",
    "instagram-followers": "2",
    "instagram-views": "3",
    "instagram-comments": "4",
    "tiktok-likes": "5",
    "tiktok-followers": "6",
    "tiktok-views": "7",
  }

  return serviceMap[`${platform}-${serviceType}`] || "1"
}

module.exports = router

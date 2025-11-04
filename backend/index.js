const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const morgan = require("morgan")
require("dotenv").config()

const logger = require("./utils/logger")
const errorHandler = require("./middleware/errorHandler")
const connectDB = require("./config/connectDB")
const cronJobs = require("./cron/statusChecker")

// Import routes
const ordersRoutes = require("./routes/orders")
const servicesRoutes = require("./routes/services")
const instagramRoutes = require("./routes/instagram")
const tiktokRoutes = require("./routes/tiktok")
const paymentRoutes = require("./routes/payment")
const adminRoutes = require("./routes/admin")

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet())

// CORS - Configure based on environment
const corsOptions = {
  origin: process.env.NODE_ENV === "production" 
    ? ["https://hypeis.us", "https://www.hypeis.us"]
    : ["http://localhost:4173", "http://127.0.0.1:4173", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}

app.use(cors(corsOptions))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
})
app.use(limiter)

// Body parser
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Logging
app.use(morgan("combined", { stream: { write: (msg) => logger.info(msg.trim()) } }))

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  })
})

// Routes
app.use("/api/orders", ordersRoutes)
app.use("/api/services", servicesRoutes)
app.use("/api/instagram", instagramRoutes)
app.use("/api/tiktok", tiktokRoutes)
app.use("/api/payment", paymentRoutes)
app.use("/api/admin", adminRoutes)

// 404
app.use("*", (req, res) => {
  res.status(404).json({ success: false, error: "Route not found" })
})

// Error handler
app.use(errorHandler)

// Start server
const startServer = async () => {
  try {
    await connectDB()

    // Start cron jobs for order tracking
    cronJobs.startAll()

    app.listen(PORT, () => {
      logger.info(`✅ Server running on port ${PORT}`)
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || "development"}`)
      logger.info(`⚡ RapidAPI configured: ${!!process.env.RAPIDAPI_KEY}`)
      logger.info(`⏰ Cron jobs started for order tracking`)
    })
  } catch (error) {
    logger.error("❌ Failed to start server:", error)
    process.exit(1)
  }
}

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received: closing HTTP server and stopping cron jobs")
  cronJobs.stopAll()
  process.exit(0)
})

process.on("SIGINT", () => {
  logger.info("SIGINT signal received: closing HTTP server and stopping cron jobs")
  cronJobs.stopAll()
  process.exit(0)
})

startServer()

module.exports = app
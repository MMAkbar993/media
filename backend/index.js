const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const morgan = require("morgan")
require("dotenv").config()

const logger = require("./utils/logger")
const errorHandler = require("./middleware/errorHandler")
const connectDB = require("./config/connectDB")  // <-- updated

// Import routes
const ordersRoutes = require("./routes/orders")
const servicesRoutes = require("./routes/services")
const instagramRoutes = require("./routes/instagram")
const tiktokRoutes = require("./routes/tiktok")
const paymentRoutes = require("./routes/payment")

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet())

// CORS
app.options("*", cors({
  origin: ["https://hypeis.us", "https://www.hypeis.us"],
 methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(cors({
  origin: ["https://hypeis.us", "https://www.hypeis.us"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

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

    app.listen(PORT, () => {
      logger.info(`✅ Server running on port ${PORT}`)
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || "development"}`)
      logger.info(`⚡ RapidAPI configured: ${!!process.env.RAPIDAPI_KEY}`)
    })
  } catch (error) {
    logger.error("❌ Failed to start server:", error)
    process.exit(1)
  }
}

startServer()

module.exports = app

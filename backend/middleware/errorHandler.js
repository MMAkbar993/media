const logger = require("../utils/logger")

const errorHandler = (err, req, res, next) => {
  logger.error("Unhandled error:", {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  })

  // Default error response
  let statusCode = 500
  let message = "Internal server error"

  // Handle specific error types
  if (err.name === "ValidationError") {
    statusCode = 400
    message = err.message
  } else if (err.name === "UnauthorizedError") {
    statusCode = 401
    message = "Unauthorized"
  } else if (err.code === "ECONNREFUSED") {
    statusCode = 503
    message = "Service temporarily unavailable"
  } else if (err.response && err.response.status) {
    // Axios error
    statusCode = err.response.status
    message = err.response.data?.message || err.message
  }

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === "production" && statusCode === 500) {
    message = "Internal server error"
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
}

module.exports = errorHandler

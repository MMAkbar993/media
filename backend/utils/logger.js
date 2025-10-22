const winston = require("winston")
const path = require("path")

// Check if we're in a serverless environment (like Vercel)
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === "production"

// Create logger with appropriate transports based on environment
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: { service: "social-media-backend" },
  transports: [],
})

// Add transports based on environment
if (isServerless) {
  // In serverless environments, only use console transport
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  )
} else {
  // In non-serverless environments, use file transports
  const fs = require("fs")
  const logDir = "logs"
  
  // Create logs directory if it doesn't exist
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir)
  }

  // Write all logs with level 'error' and below to error.log
  logger.add(
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  )
  
  // Write all logs with level 'info' and below to combined.log
  logger.add(
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  )
  
  // Separate file for API-related logs
  logger.add(
    new winston.transports.File({
      filename: path.join(logDir, "api.log"),
      level: "info",
      maxsize: 5242880,
      maxFiles: 3,
    })
  )

  // Also log to console in development
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  )
}

module.exports = logger

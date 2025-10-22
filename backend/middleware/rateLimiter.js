const rateLimit = require("express-rate-limit")
const logger = require("../utils/logger")

function createRateLimiters(redisClient) {
  // Check if Redis is available
  const useRedis = redisClient && redisClient.isAvailable

  if (!useRedis) {
    logger.warn("Redis not available, using memory-based rate limiting")
  }

  const createRateLimiter = (windowMs, max, message) => {
    const config = {
      windowMs,
      max,
      message: {
        success: false,
        error: message,
      },
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
        logger.warn("Rate limit exceeded", {
          ip: req.ip,
          path: req.path,
          userAgent: req.get("User-Agent"),
        })
        res.status(429).json({
          success: false,
          error: message,
        })
      },
    }

    // Only add Redis store if Redis is available
    if (useRedis) {
      try {
        const { RedisStore } = require("rate-limit-redis")
        config.store = new RedisStore({
          sendCommand: (...args) => redisClient.sendCommand(...args),
        })
        logger.info("Using Redis-based rate limiting")
      } catch (error) {
        logger.warn("Failed to setup Redis rate limiting, falling back to memory:", error.message)
      }
    }

    return rateLimit(config)
  }

  return {
    general: createRateLimiter(15 * 60 * 1000, 100, "Too many requests, please try again later"),
    orders: createRateLimiter(60 * 1000, 5, "Too many orders, please wait before trying again"),
    status: createRateLimiter(60 * 1000, 30, "Too many status checks, please wait"),
    auth: createRateLimiter(15 * 60 * 1000, 10, "Too many login attempts, please try again later"),
  }
}

module.exports = createRateLimiters

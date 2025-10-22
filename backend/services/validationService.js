const Joi = require("joi")
const axios = require("axios")
const logger = require("../utils/logger")

class ValidationService {
  constructor() {
    this.schemas = {
      order: Joi.object({
        platform: Joi.string().valid("instagram", "tiktok").required(),
        serviceType: Joi.string().valid("likes", "followers", "views", "comments").required(),
        targetUrl: Joi.string().uri().required(),
        quantity: Joi.number().integer().min(1).max(1000000).required(),
        email: Joi.string().email().required(),
      }),

      user: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        firstName: Joi.string().min(2).max(50),
        lastName: Joi.string().min(2).max(50),
        phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/),
      }),
    }
  }

  validateOrder(orderData) {
    const { error, value } = this.schemas.order.validate(orderData)
    if (error) {
      throw new Error(`Validation error: ${error.details[0].message}`)
    }
    return value
  }

  validateUser(userData) {
    const { error, value } = this.schemas.user.validate(userData)
    if (error) {
      throw new Error(`Validation error: ${error.details[0].message}`)
    }
    return value
  }

  async validateSocialMediaUrl(url, platform) {
    try {
      // Basic URL structure validation
      const urlObj = new URL(url)

      if (platform === "instagram") {
        return await this.validateInstagramUrl(url, urlObj)
      } else if (platform === "tiktok") {
        return await this.validateTikTokUrl(url, urlObj)
      }

      throw new Error("Unsupported platform")
    } catch (error) {
      logger.error("URL validation failed:", { url, platform, error: error.message })
      throw new Error("Invalid URL format or unsupported platform")
    }
  }

  async validateInstagramUrl(url, urlObj) {
    // Check if it's an Instagram domain
    if (!urlObj.hostname.includes("instagram.com")) {
      throw new Error("URL must be from Instagram")
    }

    // Extract post/profile information
    const pathParts = urlObj.pathname.split("/").filter((part) => part)

    if (pathParts.length === 0) {
      throw new Error("Invalid Instagram URL structure")
    }

    // Determine if it's a post or profile
    const isPost = pathParts.includes("p") || pathParts.includes("reel")
    const isProfile = pathParts.length === 1 && !isPost

    if (!isPost && !isProfile) {
      throw new Error("URL must be an Instagram post or profile")
    }

    // Check if profile/post is accessible (not private for posts)
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      })

      // Basic check for private account indicators
      if (response.data.includes("This Account is Private") || response.data.includes("private account")) {
        throw new Error("Cannot process private Instagram accounts")
      }

      return {
        isValid: true,
        type: isPost ? "post" : "profile",
        url: url,
      }
    } catch (error) {
      if (error.message.includes("private")) {
        throw error
      }

      // If we can't access it, it might be private or deleted
      throw new Error("Unable to access Instagram content. It may be private or deleted.")
    }
  }

  async validateTikTokUrl(url, urlObj) {
    // Check if it's a TikTok domain
    if (!urlObj.hostname.includes("tiktok.com")) {
      throw new Error("URL must be from TikTok")
    }

    const pathParts = urlObj.pathname.split("/").filter((part) => part)

    // TikTok URLs typically have format: /@username/video/id or /@username
    if (pathParts.length === 0 || !pathParts[0].startsWith("@")) {
      throw new Error("Invalid TikTok URL structure")
    }

    const isVideo = pathParts.includes("video")
    const isProfile = pathParts.length === 1

    if (!isVideo && !isProfile) {
      throw new Error("URL must be a TikTok video or profile")
    }

    // Basic accessibility check
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      })

      // Check for private account indicators
      if (response.data.includes("private account") || response.data.includes("This account is private")) {
        throw new Error("Cannot process private TikTok accounts")
      }

      return {
        isValid: true,
        type: isVideo ? "video" : "profile",
        url: url,
      }
    } catch (error) {
      if (error.message.includes("private")) {
        throw error
      }

      throw new Error("Unable to access TikTok content. It may be private or deleted.")
    }
  }

  async validateOrderCompatibility(platform, serviceType, urlValidation) {
    // Check if service type is compatible with URL type
    const compatibilityRules = {
      instagram: {
        likes: ["post"],
        views: ["post"],
        comments: ["post"],
        followers: ["profile"],
      },
      tiktok: {
        likes: ["video"],
        views: ["video"],
        followers: ["profile"],
      },
    }

    const allowedTypes = compatibilityRules[platform]?.[serviceType]
    if (!allowedTypes || !allowedTypes.includes(urlValidation.type)) {
      throw new Error(`${serviceType} service is not compatible with ${urlValidation.type} URLs on ${platform}`)
    }

    return true
  }
}

module.exports = new ValidationService()

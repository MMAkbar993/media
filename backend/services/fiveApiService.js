const axios = require("axios")
const logger = require("../utils/logger")
const emailService = require("../utils/emailService")
const db = require("../config/database")

class FiveApiService {
  constructor() {
    this.baseURL = process.env.FIVE_API_URL || "https://fivebbc.com/api/v2"
    this.apiKey = process.env.FIVE_API_KEY || "154ffa007fce84ac28fa39a6c799461f"
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })

    // Add request/response interceptors for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.info("Five API Request", {
          method: config.method,
          url: config.url,
          data: config.data,
        })
        return config
      },
      (error) => {
        logger.error("Five API Request Error", error)
        return Promise.reject(error)
      },
    )

    this.client.interceptors.response.use(
      (response) => {
        logger.info("Five API Response", {
          status: response.status,
          data: response.data,
        })
        return response
      },
      (error) => {
        logger.error("Five API Response Error", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        })
        return Promise.reject(error)
      },
    )
  }

  async getServices() {
    try {
      const params = new URLSearchParams({
        key: this.apiKey,
        action: "services",
      })
      const response = await this.client.post("", params.toString())
      return response.data
    } catch (error) {
      logger.error("Failed to fetch services from Five API:", error)
      throw new Error("Unable to fetch available services")
    }
  }

  async createOrder(orderData) {
    try {
      const { platform, serviceType, targetUrl, quantity } = orderData

      // Get service configuration
      const serviceConfig = await this.getServiceConfig(platform, serviceType)
      if (!serviceConfig) {
        throw new Error(`Service configuration not found for ${platform} ${serviceType}`)
      }

      // Prepare API request
      const params = new URLSearchParams({
        key: this.apiKey,
        action: "add",
        service: serviceConfig.five_api_service_id,
        link: targetUrl,
        quantity: quantity.toString(),
      })

      const response = await this.client.post("", params.toString())

      if (response.data.error) {
        // Check if it's a service ID error
        if (this.isServiceIdError(response.data.error)) {
          logger.warn("Service ID error detected, trying backup", {
            platform,
            serviceType,
            error: response.data.error,
          })

          // Try backup service ID if available
          if (serviceConfig.five_api_service_id_backup) {
            const backupParams = new URLSearchParams({
              key: this.apiKey,
              action: "add",
              service: serviceConfig.five_api_service_id_backup,
              link: targetUrl,
              quantity: quantity.toString(),
            })

            const backupResponse = await this.client.post("", backupParams.toString())

            if (!backupResponse.data.error) {
              // Backup worked, send alert to developers
              await emailService.sendServiceIdFailureAlert(
                platform,
                serviceType,
                serviceConfig.five_api_service_id,
                true,
              )

              return {
                success: true,
                orderId: backupResponse.data.order,
                serviceId: serviceConfig.five_api_service_id_backup,
              }
            }
          }

          // Both primary and backup failed, send alert
          await emailService.sendServiceIdFailureAlert(platform, serviceType, serviceConfig.five_api_service_id, false)
        }

        throw new Error(response.data.error)
      }

      return {
        success: true,
        orderId: response.data.order,
        serviceId: serviceConfig.five_api_service_id,
      }
    } catch (error) {
      logger.error("Five API order creation failed:", error)
      throw error
    }
  }

  async getOrderStatus(fiveApiOrderId) {
    try {
      const params = new URLSearchParams({
        key: this.apiKey,
        action: "status",
        order: fiveApiOrderId.toString(),
      })
      const response = await this.client.post("", params.toString())

      return response.data
    } catch (error) {
      logger.error("Failed to get order status from Five API:", error)
      throw error
    }
  }

  /**
   * Get status for multiple orders at once (up to 100 orders)
   * @param {string[]} fiveApiOrderIds - Array of Five API order IDs
   * @returns {Promise<Object>} Object with order IDs as keys and status as values
   */
  async getMultipleOrderStatuses(fiveApiOrderIds) {
    try {
      if (!Array.isArray(fiveApiOrderIds) || fiveApiOrderIds.length === 0) {
        throw new Error("Order IDs array is required and cannot be empty")
      }

      if (fiveApiOrderIds.length > 100) {
        throw new Error("Maximum 100 order IDs allowed per request")
      }

      const params = new URLSearchParams({
        key: this.apiKey,
        action: "status",
        orders: fiveApiOrderIds.join(","),
      })

      const response = await this.client.post("", params.toString())

      return response.data
    } catch (error) {
      logger.error("Failed to get multiple order statuses from Five API:", error)
      throw error
    }
  }

  async getServiceConfig(platform, serviceType) {
    try {
      const config = await db("service_configs").where({ platform, service_type: serviceType, is_active: true }).first()

      return config
    } catch (error) {
      logger.error("Failed to get service config:", error)
      throw error
    }
  }

  isServiceIdError(errorMessage) {
    const serviceIdErrorPatterns = [
      "incorrect service",
      "invalid service",
      "service not found",
      "service id",
      "service does not exist",
    ]

    const lowerError = errorMessage.toLowerCase()
    return serviceIdErrorPatterns.some((pattern) => lowerError.includes(pattern))
  }

  async validateServiceIds() {
    try {
      const services = await this.getServices()
      const configs = await db("service_configs").where({ is_active: true })

      const invalidConfigs = []

      for (const config of configs) {
        const serviceExists = services.find((s) => s.service === config.five_api_service_id)
        if (!serviceExists) {
          invalidConfigs.push(config)
        }
      }

      if (invalidConfigs.length > 0) {
        await emailService.sendDeveloperAlert(
          "Invalid Service IDs Detected",
          `Found ${invalidConfigs.length} invalid service configurations`,
          {
            invalidConfigs: invalidConfigs.map((c) => ({
              platform: c.platform,
              serviceType: c.service_type,
              serviceId: c.five_api_service_id,
            })),
          },
        )
      }

      return invalidConfigs
    } catch (error) {
      logger.error("Service ID validation failed:", error)
      throw error
    }
  }
}

module.exports = new FiveApiService()

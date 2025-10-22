const express = require("express")
const router = express.Router()
const db = require("../config/database")
const logger = require("../utils/logger")

// Get all active services
router.get("/", async (req, res) => {
  try {
    const services = await db("service_configs").where({ is_active: true }).select("*")

    res.json({
      success: true,
      data: services,
    })
  } catch (error) {
    logger.error("Failed to fetch services", { error: error.message })
    res.status(500).json({
      success: false,
      error: "Failed to fetch services",
    })
  }
})

// Get specific service configuration
router.get("/:platform/:serviceType", async (req, res) => {
  try {
    const { platform, serviceType } = req.params

    const service = await db("service_configs")
      .where({
        platform,
        service_type: serviceType,
        is_active: true,
      })
      .first()

    if (!service) {
      return res.status(404).json({
        success: false,
        error: "Service not found",
      })
    }

    res.json({
      success: true,
      data: service,
    })
  } catch (error) {
    logger.error("Failed to fetch service config", { error: error.message })
    res.status(500).json({
      success: false,
      error: "Failed to fetch service configuration",
    })
  }
})

module.exports = router

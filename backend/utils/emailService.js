const nodemailer = require("nodemailer")
const logger = require("./logger")
const fetch = require("node-fetch") // Ensure node-fetch is installed

const EMAILJS_API_BASE = process.env.EMAILJS_API_BASE || "https://api.emailjs.com"
const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID_USER = process.env.EMAILJS_TEMPLATE_ID_USER
const EMAILJS_TEMPLATE_ID_ADMIN = process.env.EMAILJS_TEMPLATE_ID_ADMIN
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY // aka user_id
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY // optional, used as Bearer in Authorization

// Normalize base URL to remove trailing slashes and /api/v1.0/email if present
function normalizeEmailJSBase(baseUrl) {
  if (!baseUrl) return "https://api.emailjs.com"
  // Remove trailing slash
  let normalized = baseUrl.replace(/\/+$/, "")
  // Remove /api/v1.0/email if it exists at the end
  normalized = normalized.replace(/\/api\/v1\.0\/email\/?$/, "")
  return normalized
}

const NORMALIZED_EMAILJS_BASE = normalizeEmailJSBase(EMAILJS_API_BASE)

// Utility to post to EmailJS REST API
async function sendViaEmailJS({ templateId, templateParams }) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    // Ensure EmailJS recognizes the request origin
    Origin: process.env.FRONTEND_URL || "http://localhost:4173",
  }
  if (EMAILJS_PRIVATE_KEY) {
    headers["Authorization"] = `Bearer ${EMAILJS_PRIVATE_KEY}`
  }
  
  // Construct the URL properly
  const emailUrl = `${NORMALIZED_EMAILJS_BASE}/api/v1.0/email/send`
  console.log("[v0] EmailJS URL:", emailUrl)
  
  const res = await fetch(emailUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: templateId,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: templateParams,
    }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    console.log("[v0] EmailJS response not ok:", res.status, text)
    throw new Error(`EmailJS send failed (${res.status}): ${text}`)
  }
  console.log("[v0] EmailJS send OK for template:", templateId)
  return true
}

class EmailService {
  constructor() {
    const smtpHost = process.env.SMTP_HOST
    const smtpPort = Number(process.env.SMTP_PORT || 587)
    const smtpSecure = process.env.SMTP_SECURE === "true"
    const smtpUser = process.env.SMTP_USER
    const smtpFrom = process.env.SMTP_FROM || "orders@yourservice.com"

    this.defaultFrom = smtpFrom

    // EmailJS mode if configured
    this.useEmailJS = !!EMAILJS_SERVICE_ID && !!EMAILJS_PUBLIC_KEY
    this.hasUserTemplate = !!EMAILJS_TEMPLATE_ID_USER
    this.hasAdminTemplate = !!EMAILJS_TEMPLATE_ID_ADMIN

    console.log("[v0] Email service mode:", this.useEmailJS ? "EmailJS" : "SMTP (nodemailer)")
    if (this.useEmailJS) {
      console.log("[v0] EmailJS configured:", {
        base: EMAILJS_API_BASE,
        normalizedBase: NORMALIZED_EMAILJS_BASE,
        fullUrl: `${NORMALIZED_EMAILJS_BASE}/api/v1.0/email/send`,
        hasServiceId: !!EMAILJS_SERVICE_ID,
        hasUserKey: !!EMAILJS_PUBLIC_KEY,
        hasPrivateKey: !!EMAILJS_PRIVATE_KEY,
        hasUserTemplate: this.hasUserTemplate,
        hasAdminTemplate: this.hasAdminTemplate,
      })
    }

    if (!this.useEmailJS) {
      // Existing SMTP setup remains as fallback
      if (!smtpHost || !smtpUser || !process.env.SMTP_PASS) {
        logger.warn("SMTP not fully configured. Check SMTP_HOST/SMTP_USER/SMTP_PASS.")
        console.log("[v0] SMTP missing config:", {
          host: smtpHost,
          port: smtpPort,
          secure: smtpSecure,
          hasUser: !!smtpUser,
          hasPass: !!process.env.SMTP_PASS,
          from: smtpFrom,
        })
      }

      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: smtpUser && process.env.SMTP_PASS ? { user: smtpUser, pass: process.env.SMTP_PASS } : undefined,
      })

      console.log("[v0] Verifying SMTP transporter...", {
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        from: smtpFrom,
        hasAuth: !!smtpUser && !!process.env.SMTP_PASS,
      })
      this.transporter
        .verify()
        .then(() => {
          logger.info("SMTP transporter verified", { host: smtpHost, port: smtpPort, secure: smtpSecure })
          console.log("[v0] SMTP verification succeeded")
        })
        .catch((err) => {
          logger.error("SMTP transporter verification failed", { error: err.message, host: smtpHost, port: smtpPort })
          console.log("[v0] SMTP verification failed:", err?.message)
        })
    }
  }

  async sendDeveloperAlert(subject, message, metadata = {}) {
    try {
      const developerEmails = process.env.DEVELOPER_EMAILS?.split(",") || []

      if (developerEmails.length === 0) {
        logger.warn("No developer emails configured for alerts")
        return
      }

      const emailContent = {
        from: this.defaultFrom,
        to: developerEmails.join(","),
        subject: `[ALERT] ${subject}`,
        html: `
          <h2>System Alert</h2>
          <p><strong>Message:</strong> ${message}</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          ${
            metadata && Object.keys(metadata).length > 0
              ? `
            <h3>Additional Details:</h3>
            <pre>${JSON.stringify(metadata, null, 2)}</pre>
          `
              : ""
          }
        `,
      }

      await this.transporter.sendMail(emailContent)
      logger.info("Developer alert email sent successfully", { subject })
    } catch (error) {
      logger.error("Failed to send developer alert email:", error)
      console.log("[v0] sendDeveloperAlert error:", error?.message)
    }
  }

  async sendServiceIdFailureAlert(platform, serviceType, failedServiceId, backupUsed = false) {
    const subject = `Service ID Failure - ${platform} ${serviceType}`
    const message = `
      The Five API service ID for ${platform} ${serviceType} has failed.
      
      Failed Service ID: ${failedServiceId}
      Backup Service ID Used: ${backupUsed ? "Yes" : "No"}
      
      Please check the Five API dashboard and update the service configuration.
    `

    await this.sendDeveloperAlert(subject, message, {
      platform,
      serviceType,
      failedServiceId,
      backupUsed,
    })
  }

  async sendOrderFailureAlert(orderId, orderNumber, error) {
    const subject = `Order Processing Failure - ${orderNumber}`
    const message = `
      Order processing has failed and requires manual intervention.
      
      Order ID: ${orderId}
      Order Number: ${orderNumber}
      Error: ${error.message}
    `

    await this.sendDeveloperAlert(subject, message, {
      orderId,
      orderNumber,
      error: error.stack,
    })
  }

  async sendOrderConfirmationEmail(userEmail, order) {
    try {
      if (this.useEmailJS) {
        if (!this.hasUserTemplate) {
          console.log("[v0] EmailJS user template missing (EMAILJS_TEMPLATE_ID_USER not set) — skipping user email")
        } else {
          const templateParams = {
            // These keys must match your EmailJS template variables
            to_email: userEmail,
            user_email: userEmail,
            order_number: order.order_number,
            platform: order.platform,
            service_type: order.service_type,
            quantity: String(order.quantity),
            amount: String(order.amount),
            currency: order.currency || "USD",
            track_url: `${process.env.FRONTEND_URL || "http://localhost:4173"}/track-order?orderId=${order.order_number}`,
            created_at: new Date().toISOString(),
            subject: `Your Order Confirmation - ${order.order_number}`,
          }
          console.log("[v0] EmailJS: sending user confirmation", { to: userEmail, order: order.order_number })
          await sendViaEmailJS({ templateId: EMAILJS_TEMPLATE_ID_USER, templateParams })
          logger.info("Order confirmation email sent via EmailJS", { userEmail, orderId: order.order_number })
          return
        }
      }

      // original SMTP path
      const emailContent = {
        from: this.defaultFrom,
        to: userEmail,
        subject: `Your Order Confirmation - ${order.order_number}`,
        html: `
          <h2>Thank you for your order!</h2>
          <p>Your order <strong>${order.order_number}</strong> has been received and is being processed.</p>
          <p><strong>Service:</strong> ${order.platform} ${order.service_type}</p>
          <p><strong>Quantity:</strong> ${order.quantity}</p>
          <p><strong>Amount:</strong> $${order.amount} ${order.currency}</p>
          <p>You can track your order status here: <a href="${process.env.FRONTEND_URL || "http://localhost:4173"}/track-order?orderId=${order.order_number}">Track Order</a></p>
          <p>If you have any questions, reply to this email.</p>
          <hr />
          <p>Thank you for choosing us!</p>
        `,
      }
      console.log("[v0] SMTP: Sending user confirmation email to:", userEmail)
      await this.transporter.sendMail(emailContent)
      logger.info("Order confirmation email sent to user", { userEmail, orderId: order.order_number })
    } catch (error) {
      logger.error("Failed to send order confirmation email to user:", error)
      console.log("[v0] sendOrderConfirmationEmail error:", error?.message)
    }
  }

  async sendNewOrderNotification(userEmail, orderSummary) {
    try {
      const to = process.env.ADMIN_ORDER_EMAIL || "akbarmm428@gmail.com"

      if (this.useEmailJS) {
        if (!this.hasAdminTemplate) {
          console.log("[v0] EmailJS admin template missing (EMAILJS_TEMPLATE_ID_ADMIN not set) — skipping admin email")
        } else {
          const templateParams = {
            to_email: to,
            customer_email: userEmail,
            order_number: orderSummary.orderNumber,
            order_id: orderSummary.orderId,
            platform: orderSummary.platform,
            service_type: orderSummary.serviceType,
            quantity: String(orderSummary.quantity),
            amount: String(orderSummary.amount),
            currency: orderSummary.currency || "USD",
            target_url: orderSummary.targetUrl || "",
            created_at: new Date().toISOString(),
            subject: `[NEW ORDER] ${orderSummary.orderNumber} - ${orderSummary.platform} ${orderSummary.serviceType}`,
          }
          console.log("[v0] EmailJS: sending admin new-order", { to, order: orderSummary.orderNumber })
          await sendViaEmailJS({ templateId: EMAILJS_TEMPLATE_ID_ADMIN, templateParams })
          logger.info("Admin new-order notification sent via EmailJS", { to, orderNumber: orderSummary.orderNumber })
          return
        }
      }

      // original SMTP path
      const emailContent = {
        from: this.defaultFrom,
        to,
        subject: `[NEW ORDER] ${orderSummary.orderNumber} - ${orderSummary.platform} ${orderSummary.serviceType}`,
        html: `
          <h2>New Order Received</h2>
          <p><strong>Customer Email:</strong> ${userEmail}</p>
          <p><strong>Order Number:</strong> ${orderSummary.orderNumber}</p>
          <p><strong>Order ID:</strong> ${orderSummary.orderId}</p>
          <p><strong>Platform:</strong> ${orderSummary.platform}</p>
          <p><strong>Service Type:</strong> ${orderSummary.serviceType}</p>
          <p><strong>Quantity:</strong> ${orderSummary.quantity}</p>
          <p><strong>Amount:</strong> $${orderSummary.amount} ${orderSummary.currency || "USD"}</p>
          ${orderSummary.targetUrl ? `<p><strong>Target URL:</strong> ${orderSummary.targetUrl}</p>` : ""}
          <hr />
          <p>Created At: ${new Date().toISOString()}</p>
        `,
      }
      console.log("[v0] SMTP: Sending admin new-order email to:", to, "for order:", orderSummary.orderNumber)
      await this.transporter.sendMail(emailContent)
      logger.info("Admin new-order notification sent", { to, orderNumber: orderSummary.orderNumber })
    } catch (error) {
      logger.error("Failed to send admin new-order notification:", error)
      console.log("[v0] sendNewOrderNotification error:", error?.message)
    }
  }
}

module.exports = new EmailService()

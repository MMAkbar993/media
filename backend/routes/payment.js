const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = Stripe("sk_test_26PHem9AhJZvU623DfE1x4sd");

// --- PayPal SDK Setup ---
const paypal = require("@paypal/checkout-server-sdk");
const paypalEnv = process.env.PAYPAL_MODE === "live"
  ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
  : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
const paypalClient = new paypal.core.PayPalHttpClient(paypalEnv);

// Stripe: Create PaymentIntent
router.post("/create-intent", async (req, res) => {
  try {
    const { amount, currency = "usd" } = req.body;
    if (!amount) return res.status(400).json({ error: "Amount is required" });
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method_types: ["card"],
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PayPal: Create Order
router.post("/create-paypal-order", async (req, res) => {
  try {
    const { amount, currency = "USD" } = req.body;
    if (!amount) return res.status(400).json({ error: "Amount is required" });
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: (amount / 100).toFixed(2), // PayPal expects string in dollars
          },
        },
      ],
      application_context: {
        return_url: process.env.PAYPAL_RETURN_URL || "http://localhost:4173/payment-success",
        cancel_url: process.env.PAYPAL_CANCEL_URL || "http://localhost:4173/payment-cancel",
      },
    });
    const order = await paypalClient.execute(request);
    const approvalUrl = order.result.links.find(link => link.rel === "approve")?.href;
    res.json({ id: order.result.id, approvalUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 
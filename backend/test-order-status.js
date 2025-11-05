/**
 * Test script to check order status from Five BBC API
 * Usage: node test-order-status.js [orderId]
 */

require("dotenv").config()

async function testOrderStatus(orderId) {
  try {
    // Override environment variables for testing - use provided key
    const testApiKey = "12aafc34750fd3ea84245a727bd131d5"
    process.env.FIVE_API_KEY = testApiKey
    process.env.FIVE_API_URL = "https://fivebbc.com/api/v2"
    
    // Re-require the service to get fresh instance with correct config
    delete require.cache[require.resolve("./services/fiveApiService")]
    const fiveApiService = require("./services/fiveApiService")
    
    console.log(`\n🔍 Testing order status for order ID: ${orderId}\n`)
    console.log("API Key:", process.env.FIVE_API_KEY)
    console.log("API Base URL:", process.env.FIVE_API_URL)
    console.log("\n" + "=".repeat(60) + "\n")

    const statusResponse = await fiveApiService.getOrderStatus(orderId)

    console.log("✅ Order Status Response:")
    console.log(JSON.stringify(statusResponse, null, 2))
    console.log("\n" + "=".repeat(60) + "\n")

    // Parse and display formatted information
    if (statusResponse.error) {
      console.log("❌ Error:", statusResponse.error)
    } else {
      console.log("📊 Order Details:")
      console.log(`   Status: ${statusResponse.status || "N/A"}`)
      console.log(`   Charge: ${statusResponse.charge || "N/A"} ${statusResponse.currency || "USD"}`)
      console.log(`   Start Count: ${statusResponse.start_count || "N/A"}`)
      console.log(`   Remains: ${statusResponse.remains || "N/A"}`)
      console.log(`   Currency: ${statusResponse.currency || "USD"}`)
      
      if (statusResponse.status === "Completed") {
        console.log("\n✅ Order is completed!")
      } else if (statusResponse.status === "Partial") {
        console.log("\n⚠️  Order is partially completed")
      } else if (statusResponse.status === "In progress" || statusResponse.status === "Processing") {
        console.log("\n⏳ Order is in progress")
      }
    }
  } catch (error) {
    console.error("\n❌ Error fetching order status:")
    console.error(error.message)
    if (error.response) {
      console.error("Response status:", error.response.status)
      console.error("Response data:", JSON.stringify(error.response.data, null, 2))
    }
  }
}

// Get order ID from command line argument or use default
const orderId = process.argv[2] || "2851341"

testOrderStatus(orderId)
  .then(() => {
    console.log("\n✅ Test completed")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n❌ Test failed:", error)
    process.exit(1)
  })


const db = require("./database")

async function connectDB() {
  try {
    const cfg = db?.client?.config || {}
    const conn = cfg.connection
    const safeConn = conn && typeof conn === "object" ? { ...conn } : typeof conn === "string" ? { url: conn } : conn
    if (safeConn && safeConn.password) safeConn.password = "***"

    console.log("[v0] DB client:", cfg.client)
    console.log("[v0] DB connection (sanitized):", safeConn)

    // Verify connectivity
    await db.raw("SELECT 1+1 AS result")
    console.log("✅ Database connection successful")

    // Run pending migrations on startup
    try {
      const [batch, migrations] = await db.migrate.latest()
      console.log("[v0] Knex migrate.latest completed:", { batch, migrations })
    } catch (mErr) {
      const msg = (mErr && mErr.message) || ""
      if (mErr?.code === "ER_TABLE_EXISTS_ERROR" || msg.includes("already exists")) {
        console.warn("[v0] Migration warning (non-fatal):", {
          code: mErr?.code,
          errno: mErr?.errno,
          sqlState: mErr?.sqlState,
          message: msg,
        })
      } else {
        throw mErr
      }
    }

    return true
  } catch (err) {
    console.error("❌ Database connection failed:", err)
    throw err
  }
}

module.exports = connectDB

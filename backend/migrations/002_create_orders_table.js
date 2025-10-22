exports.up = async (knex) => {
  const exists = await knex.schema.hasTable("orders")
  if (exists) return
  return knex.schema.createTable("orders", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("UUID()")) // Customer-facing order ID
    table.string("order_number").unique().notNullable() // Customer-facing order ID
    table.string("five_api_order_id").unique() // Five API internal order ID
    table.uuid("user_id").references("id").inTable("users").onDelete("CASCADE")

    // Service details
    table.enum("platform", ["instagram", "tiktok"]).notNullable()
    table.enum("service_type", ["likes", "followers", "views", "comments"]).notNullable()
    table.string("target_url").notNullable() // Post/Profile URL
    table.integer("quantity").notNullable()
    table.decimal("amount", 10, 2).notNullable()
    table.string("currency", 3).defaultTo("USD")

    // Order status tracking
    table
      .enum("status", [
        "pending_payment",
        "payment_confirmed",
        "processing",
        "in_progress",
        "completed",
        "partial",
        "cancelled",
        "refunded",
        "failed",
      ])
      .defaultTo("pending_payment")

    table.integer("delivered_quantity").defaultTo(0)
    table.decimal("completion_percentage", 5, 2).defaultTo(0)

    // Five API service details
    table.string("five_api_service_id").notNullable()
    table.string("five_api_service_name")
    table.json("five_api_response") // Store full API responses

    // Timestamps
    table.timestamp("started_at")
    table.timestamp("completed_at")
    table.timestamps(true, true)

    // Indexes for performance
    table.index(["user_id"])
    table.index(["status"])
    table.index(["platform", "service_type"])
    table.index(["five_api_order_id"])
    table.index(["created_at"])
  })
}

exports.down = (knex) => knex.schema.dropTable("orders")

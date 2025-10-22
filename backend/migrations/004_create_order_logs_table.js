exports.up = async (knex) => {
  const exists = await knex.schema.hasTable("order_logs")
  if (exists) return
  return knex.schema.createTable("order_logs", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("UUID()"))
    table.uuid("order_id").references("id").inTable("orders").onDelete("CASCADE")
    table
      .enum("event_type", [
        "created",
        "payment_confirmed",
        "submitted_to_api",
        "api_response_received",
        "status_updated",
        "completed",
        "failed",
        "cancelled",
      ])
      .notNullable()
    table.text("message")
    table.json("metadata") // Store additional data
    table.timestamp("created_at").defaultTo(knex.fn.now())

    table.index(["order_id"])
    table.index(["event_type"])
    table.index(["created_at"])
  })
}

exports.down = (knex) => knex.schema.dropTable("order_logs")

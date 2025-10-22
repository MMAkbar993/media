exports.up = async (knex) => {
  const exists = await knex.schema.hasTable("users")
  if (exists) return
  return knex.schema.createTable("users", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("UUID()"))
    table.string("email").unique().notNullable()
    table.string("password_hash").notNullable()
    table.string("first_name")
    table.string("last_name")
    table.string("phone")
    table.enum("status", ["active", "suspended", "banned"]).defaultTo("active")
    table.integer("failed_login_attempts").defaultTo(0)
    table.timestamp("last_login_attempt")
    table.timestamp("email_verified_at")
    table.timestamps(true, true)

    table.index(["email"])
    table.index(["status"])
  })
}

exports.down = (knex) => knex.schema.dropTable("users")

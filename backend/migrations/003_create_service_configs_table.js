exports.up = async (knex) => {
  const exists = await knex.schema.hasTable("service_configs")
  if (exists) return
  return knex.schema.createTable("service_configs", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("UUID()"))
    table.enum("platform", ["instagram", "tiktok"]).notNullable()
    table.enum("service_type", ["likes", "followers", "views", "comments"]).notNullable()
    table.string("five_api_service_id").notNullable() // Primary service ID
    table.string("five_api_service_id_backup") // Backup service ID
    table.string("service_name").notNullable()
    table.text("description")
    table.decimal("price_per_unit", 10, 6).notNullable()
    table.integer("min_quantity").defaultTo(1)
    table.integer("max_quantity").defaultTo(100000)
    table.boolean("is_active").defaultTo(true)
    table.json("validation_rules") // Custom validation rules
    table.timestamps(true, true)

    table.unique(["platform", "service_type"])
    table.index(["is_active"])
  })
}

exports.down = (knex) => knex.schema.dropTable("service_configs")

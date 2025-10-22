const knex = require("knex")
// Ensure mysql2 driver is bundled/available
require("mysql2")

const shared = {
  pool: {
    min: 2,
    max: 20,
    acquireTimeoutMillis: 60000,
    idleTimeoutMillis: 600000,
  },
  migrations: {
    directory: "./migrations",
  },
  seeds: {
    directory: "./seeds",
  },
}

const devConnection =
  process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("mysql")
    ? process.env.DATABASE_URL
    : {
        host: process.env.DB_HOST || "127.0.0.1",
        port: Number(process.env.DB_PORT) || 3306,
        database: process.env.DB_NAME || "social_media_service",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT_MS) || 15000,
        ...(process.env.DB_SSL === "true" ? { ssl: { rejectUnauthorized: false } } : {}),
      }

const prodConnection =
  process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("mysql")
    ? process.env.DATABASE_URL
    : {
        host: process.env.DB_HOST || "127.0.0.1",
        port: Number(process.env.DB_PORT) || 3306,
        database: process.env.DB_NAME || "social_media_service",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT_MS) || 15000,
        ...(process.env.DB_SSL === "true" ? { ssl: { rejectUnauthorized: false } } : {}),
      }

const config = {
  development: {
    client: "mysql2",
    connection: devConnection,
    ...shared,
  },
  production: {
    client: "mysql2",
    connection: prodConnection,
    pool: {
      min: 5,
      max: 50,
      acquireTimeoutMillis: 60000,
      idleTimeoutMillis: 600000,
    },
    migrations: {
      directory: "./migrations",
    },
  },
}

const environment = process.env.NODE_ENV || "development"
const db = knex(config[environment])

module.exports = db

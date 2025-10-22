const { createClient } = require("redis");
const logger = require("../utils/logger");

let client = null;
let isRedisAvailable = false;

// Create Redis client with remote config
const createRedisClient = () => {
  const redisClient = createClient({
    socket: {
      host: process.env.REDIS_HOST || "redis-17987.c8.us-east-1-3.ec2.redns.redis-cloud.com",
      port: process.env.REDIS_PORT || 17987,
      connectTimeout: 5000,
      lazyConnect: true,
    },
    username: process.env.REDIS_USERNAME || "default",
    password: process.env.REDIS_PASSWORD || "8szfn7x2TiwHKCpync9kf8wVMpEPvi9h",
  });

  redisClient.on("error", (err) => {
    logger.warn("Redis Client Error:", err);
    isRedisAvailable = false;
  });

  redisClient.on("connect", () => {
    logger.info("Redis connected successfully");
    isRedisAvailable = true;
  });

  redisClient.on("disconnect", () => {
    logger.warn("Redis disconnected");
    isRedisAvailable = false;
  });

  return redisClient;
};

// Initialize client
client = createRedisClient();

// Mock Redis client fallback
const mockRedisClient = {
  connect: async () => {
    logger.warn("Using mock Redis client - Redis not available");
    return Promise.resolve();
  },
  disconnect: async () => Promise.resolve(),
  ping: async () => Promise.resolve("PONG"),
  get: async () => null,
  set: async () => "OK",
  del: async () => 1,
  exists: async () => 0,
  expire: async () => 1,
  sendCommand: async () => null,
  isReady: false,
};

// Export wrapper
module.exports = {
  async connect() {
    try {
      await client.connect();
      isRedisAvailable = true;
      return client;
    } catch (error) {
      logger.warn("Redis connection failed, using mock client:", error.message);
      isRedisAvailable = false;
      return mockRedisClient;
    }
  },

  async disconnect() {
    if (isRedisAvailable && client) {
      try {
        await client.disconnect();
      } catch (error) {
        logger.warn("Error disconnecting Redis:", error.message);
      }
    }
  },

  async ping() {
    if (isRedisAvailable && client) {
      try {
        return await client.ping();
      } catch (error) {
        logger.warn("Redis ping failed:", error.message);
        isRedisAvailable = false;
        return "PONG";
      }
    }
    return "PONG";
  },

  get client() {
    return isRedisAvailable ? client : mockRedisClient;
  },

  get isAvailable() {
    return isRedisAvailable;
  },

  sendCommand: async (...args) => {
    if (isRedisAvailable && client) {
      try {
        return await client.sendCommand(args);
      } catch (error) {
        logger.warn("Redis command failed:", error.message);
        return null;
      }
    }
    return null;
  },
};

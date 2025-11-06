/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries (use with caution)
  // await knex("service_configs").del()
  
  // Check if data already exists
  const existing = await knex("service_configs").count("* as count").first()
  
  if (parseInt(existing.count) > 0) {
    console.log("Service configs already exist, skipping seed")
    return
  }

  // Insert default service configurations
  await knex("service_configs").insert([
    // Instagram Services
    {
      platform: "instagram",
      service_type: "likes",
      five_api_service_id: "7504",
      five_api_service_id_backup: null,
      service_name: "Instagram Likes - High Quality",
      description: "Real Instagram likes from active users",
      price_per_unit: 0.001,
      min_quantity: 10,
      max_quantity: 100000,
      is_active: true,
    },
    {
      platform: "instagram",
      service_type: "followers",
      five_api_service_id: "12680",
      five_api_service_id_backup: null,
      service_name: "Instagram Followers - Real",
      description: "Genuine Instagram followers that stay",
      price_per_unit: 0.01,
      min_quantity: 10,
      max_quantity: 50000,
      is_active: true,
    },
    {
      platform: "instagram",
      service_type: "views",
      five_api_service_id: "6624",
      five_api_service_id_backup: null,
      service_name: "Instagram Video Views",
      description: "High-quality video views for posts and reels",
      price_per_unit: 0.0005,
      min_quantity: 100,
      max_quantity: 1000000,
      is_active: true,
    },
    {
      platform: "instagram",
      service_type: "comments",
      five_api_service_id: "4",
      five_api_service_id_backup: "104",
      service_name: "Instagram Comments - Custom",
      description: "Relevant comments from real users",
      price_per_unit: 0.05,
      min_quantity: 1,
      max_quantity: 1000,
      is_active: true,
    },
    // TikTok Services
    {
      platform: "tiktok",
      service_type: "likes",
      five_api_service_id: "4822",
      five_api_service_id_backup: null,
      service_name: "TikTok Likes - Premium",
      description: "Real TikTok likes from active users",
      price_per_unit: 0.002,
      min_quantity: 10,
      max_quantity: 100000,
      is_active: true,
    },
    {
      platform: "tiktok",
      service_type: "followers",
      five_api_service_id: "10173",
      five_api_service_id_backup: null,
      service_name: "TikTok Followers - Organic",
      description: "Genuine TikTok followers",
      price_per_unit: 0.015,
      min_quantity: 10,
      max_quantity: 25000,
      is_active: true,
    },
    {
      platform: "tiktok",
      service_type: "views",
      five_api_service_id: "6366",
      five_api_service_id_backup: null,
      service_name: "TikTok Video Views",
      description: "High-retention TikTok video views",
      price_per_unit: 0.0003,
      min_quantity: 100,
      max_quantity: 1000000,
      is_active: true,
    },
  ])
  
  console.log("✅ Service configurations seeded successfully")
}


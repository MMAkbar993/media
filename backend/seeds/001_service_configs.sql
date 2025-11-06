-- Insert default service configurations
INSERT INTO service_configs (platform, service_type, five_api_service_id, five_api_service_id_backup, service_name, description, price_per_unit, min_quantity, max_quantity, is_active) VALUES
-- Instagram Services
('instagram', 'likes', '7504', NULL, 'Instagram Likes - High Quality', 'Real Instagram likes from active users', 0.001, 10, 100000, true),
('instagram', 'followers', '12680', NULL, 'Instagram Followers - Real', 'Genuine Instagram followers that stay', 0.01, 10, 50000, true),
('instagram', 'views', '6624', NULL, 'Instagram Video Views', 'High-quality video views for posts and reels', 0.0005, 100, 1000000, true),
('instagram', 'comments', '4', '104', 'Instagram Comments - Custom', 'Relevant comments from real users', 0.05, 1, 1000, true),

-- TikTok Services  
('tiktok', 'likes', '4822', NULL, 'TikTok Likes - Premium', 'Real TikTok likes from active users', 0.002, 10, 100000, true),
('tiktok', 'followers', '10173', NULL, 'TikTok Followers - Organic', 'Genuine TikTok followers', 0.015, 10, 25000, true),
('tiktok', 'views', '6366', NULL, 'TikTok Video Views', 'High-retention TikTok video views', 0.0003, 100, 1000000, true);

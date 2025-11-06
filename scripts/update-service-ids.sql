-- Update service IDs for Five API integration
-- Run this script to update existing service configurations in your database

UPDATE service_configs 
SET five_api_service_id = '7504', 
    five_api_service_id_backup = NULL,
    updated_at = CURRENT_TIMESTAMP
WHERE platform = 'instagram' AND service_type = 'likes';

UPDATE service_configs 
SET five_api_service_id = '12680', 
    five_api_service_id_backup = NULL,
    updated_at = CURRENT_TIMESTAMP
WHERE platform = 'instagram' AND service_type = 'followers';

UPDATE service_configs 
SET five_api_service_id = '6624', 
    five_api_service_id_backup = NULL,
    updated_at = CURRENT_TIMESTAMP
WHERE platform = 'instagram' AND service_type = 'views';

UPDATE service_configs 
SET five_api_service_id = '4822', 
    five_api_service_id_backup = NULL,
    updated_at = CURRENT_TIMESTAMP
WHERE platform = 'tiktok' AND service_type = 'likes';

UPDATE service_configs 
SET five_api_service_id = '10173', 
    five_api_service_id_backup = NULL,
    updated_at = CURRENT_TIMESTAMP
WHERE platform = 'tiktok' AND service_type = 'followers';

UPDATE service_configs 
SET five_api_service_id = '6366', 
    five_api_service_id_backup = NULL,
    updated_at = CURRENT_TIMESTAMP
WHERE platform = 'tiktok' AND service_type = 'views';

-- Verify the updates
SELECT platform, service_type, five_api_service_id, five_api_service_id_backup 
FROM service_configs 
WHERE is_active = true 
ORDER BY platform, service_type;


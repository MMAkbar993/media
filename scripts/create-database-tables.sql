-- Create database tables for the social media service

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned')),
    failed_login_attempts INTEGER DEFAULT 0,
    last_login_attempt TIMESTAMP,
    email_verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    five_api_order_id VARCHAR(100) UNIQUE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Service details
    platform VARCHAR(20) NOT NULL CHECK (platform IN ('instagram', 'tiktok')),
    service_type VARCHAR(20) NOT NULL CHECK (service_type IN ('likes', 'followers', 'views', 'comments')),
    target_url TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Order status tracking
    status VARCHAR(20) DEFAULT 'pending_payment' CHECK (status IN (
        'pending_payment', 'payment_confirmed', 'processing', 'in_progress', 
        'completed', 'partial', 'cancelled', 'refunded', 'failed'
    )),
    delivered_quantity INTEGER DEFAULT 0,
    completion_percentage DECIMAL(5, 2) DEFAULT 0,
    
    -- Five API service details
    five_api_service_id VARCHAR(50) NOT NULL,
    five_api_service_name VARCHAR(255),
    five_api_response JSONB,
    
    -- Timestamps
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Service configurations table
CREATE TABLE IF NOT EXISTS service_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform VARCHAR(20) NOT NULL CHECK (platform IN ('instagram', 'tiktok')),
    service_type VARCHAR(20) NOT NULL CHECK (service_type IN ('likes', 'followers', 'views', 'comments')),
    five_api_service_id VARCHAR(50) NOT NULL,
    five_api_service_id_backup VARCHAR(50),
    service_name VARCHAR(255) NOT NULL,
    description TEXT,
    price_per_unit DECIMAL(10, 6) NOT NULL,
    min_quantity INTEGER DEFAULT 1,
    max_quantity INTEGER DEFAULT 100000,
    is_active BOOLEAN DEFAULT true,
    validation_rules JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(platform, service_type)
);

-- Order logs table
CREATE TABLE IF NOT EXISTS order_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN (
        'created', 'payment_confirmed', 'submitted_to_api', 'api_response_received',
        'status_updated', 'completed', 'failed', 'cancelled'
    )),
    message TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_platform_service ON orders(platform, service_type);
CREATE INDEX IF NOT EXISTS idx_orders_five_api_order_id ON orders(five_api_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_service_configs_active ON service_configs(is_active);
CREATE INDEX IF NOT EXISTS idx_order_logs_order_id ON order_logs(order_id);
CREATE INDEX IF NOT EXISTS idx_order_logs_event_type ON order_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_order_logs_created_at ON order_logs(created_at);

-- Insert default service configurations
INSERT INTO service_configs (platform, service_type, five_api_service_id, five_api_service_id_backup, service_name, description, price_per_unit, min_quantity, max_quantity, is_active) VALUES
-- Instagram Services
('instagram', 'likes', '1', '101', 'Instagram Likes - High Quality', 'Real Instagram likes from active users', 0.001, 10, 100000, true),
('instagram', 'followers', '2', '102', 'Instagram Followers - Real', 'Genuine Instagram followers that stay', 0.01, 10, 50000, true),
('instagram', 'views', '3', '103', 'Instagram Video Views', 'High-quality video views for posts and reels', 0.0005, 100, 1000000, true),
('instagram', 'comments', '4', '104', 'Instagram Comments - Custom', 'Relevant comments from real users', 0.05, 1, 1000, true),

-- TikTok Services  
('tiktok', 'likes', '5', '105', 'TikTok Likes - Premium', 'Real TikTok likes from active users', 0.002, 10, 100000, true),
('tiktok', 'followers', '6', '106', 'TikTok Followers - Organic', 'Genuine TikTok followers', 0.015, 10, 25000, true),
('tiktok', 'views', '7', '107', 'TikTok Video Views', 'High-retention TikTok video views', 0.0003, 100, 1000000, true)
ON CONFLICT (platform, service_type) DO NOTHING;

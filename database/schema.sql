-- ===================================
-- DATABASE SCHEMA
-- ===================================

-- Create database
CREATE DATABASE IF NOT EXISTS project_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE project_database;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

-- ===================================
-- USERS TABLE
-- ===================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin') DEFAULT 'customer' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- PRODUCTS TABLE
-- ===================================
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_title (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- ORDERS TABLE
-- ===================================
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    product_details JSON NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_customer_id (customer_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================
-- SEED DATA
-- ===================================

-- Insert sample products with Naira pricing
INSERT INTO products (title, description, price, status) VALUES
('Website Development', 'Professional website development service with modern technologies', 450000.00, 'active'),
('Mobile App Development', 'Native and cross-platform mobile application development', 600000.00, 'active'),
('E-Commerce Solution', 'Complete e-commerce platform with payment integration', 750000.00, 'active'),
('SEO Optimization', 'Search engine optimization service to boost your online presence', 150000.00, 'active'),
('Digital Marketing', 'Comprehensive digital marketing campaign management', 225000.00, 'active'),
('Cloud Hosting Setup', 'Professional cloud infrastructure setup and management', 300000.00, 'active'),
('Database Design', 'Custom database design and optimization services', 240000.00, 'active'),
('API Integration', 'Third-party API integration and custom API development', 360000.00, 'active');

-- ===================================
-- ADMIN SEED SCRIPT
-- Run separately: php backend/utils/create_admin.php
-- ===================================

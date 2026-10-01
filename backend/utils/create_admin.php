<?php
/**
 * Admin User Creation Script
 * Run this script once to create the initial admin user
 * 
 * Usage: php backend/utils/create_admin.php
 */

require_once __DIR__ . '/../config/env.php';
require_once __DIR__ . '/../models/User.php';

try {
    $userModel = new User();

    $adminEmail = $_ENV['ADMIN_EMAIL'] ?? 'admin@example.com';
    $adminPassword = $_ENV['ADMIN_PASSWORD'] ?? 'SecureAdmin@123';
    $adminName = $_ENV['ADMIN_NAME'] ?? 'System Administrator';

    // Check if admin already exists
    if ($userModel->emailExists($adminEmail)) {
        echo "Admin user already exists with email: {$adminEmail}\n";
        exit(1);
    }

    // Create admin user
    $userId = $userModel->create($adminName, $adminEmail, $adminPassword, 'admin');

    echo "Admin user created successfully!\n";
    echo "--------------------------------\n";
    echo "ID: {$userId}\n";
    echo "Name: {$adminName}\n";
    echo "Email: {$adminEmail}\n";
    echo "Password: {$adminPassword}\n";
    echo "Role: admin\n";
    echo "--------------------------------\n";
    echo "IMPORTANT: Change the password after first login!\n";

} catch (Exception $e) {
    echo "Error creating admin user: " . $e->getMessage() . "\n";
    exit(1);
}

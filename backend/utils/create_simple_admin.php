<?php
/**
 * Create Simple Admin User
 * Alternative admin creation with simpler credentials
 */

require_once __DIR__ . '/../config/env.php';
require_once __DIR__ . '/../models/User.php';

try {
    $userModel = new User();

    $adminEmail = 'admin@admin.com';
    $adminPassword = 'admin123';
    $adminName = 'Admin User';

    // Check if admin already exists
    if ($userModel->emailExists($adminEmail)) {
        echo "Admin user already exists with email: {$adminEmail}\n";
        exit(1);
    }

    // Create admin user
    $userId = $userModel->create($adminName, $adminEmail, $adminPassword, 'admin');

    echo "Simple Admin user created successfully!\n";
    echo "=========================================\n";
    echo "ID: {$userId}\n";
    echo "Name: {$adminName}\n";
    echo "Email: {$adminEmail}\n";
    echo "Password: {$adminPassword}\n";
    echo "Role: admin\n";
    echo "=========================================\n";
    echo "Use these credentials to login!\n";

} catch (Exception $e) {
    echo "Error creating admin user: " . $e->getMessage() . "\n";
    exit(1);
}
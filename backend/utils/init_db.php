<?php
/**
 * Auto-initialize database schema if tables do not exist
 */

require_once __DIR__ . '/../config/database.php';

try {
    $db = Database::getInstance()->getConnection();
    
    // Check if products table exists
    $stmt = $db->query("SHOW TABLES LIKE 'products'");
    $hasProducts = $stmt->fetch();
    
    if (!$hasProducts) {
        echo "Initializing database schema...\n";
        $schemaPath = __DIR__ . '/../../database/schema_aiven.sql';
        if (!file_exists($schemaPath)) {
            $schemaPath = __DIR__ . '/../database/schema_aiven.sql';
        }
        
        if (file_exists($schemaPath)) {
            $sql = file_get_contents($schemaPath);
            $db->exec($sql);
            echo "Database schema initialized successfully with tables and seed data!\n";
        } else {
            echo "Schema file not found, skipping.\n";
        }
    } else {
        echo "Database tables already exist. Skipping schema initialization.\n";
    }
} catch (Exception $e) {
    echo "Database initialization notice: " . $e->getMessage() . "\n";
}

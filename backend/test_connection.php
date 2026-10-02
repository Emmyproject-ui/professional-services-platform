<?php
require_once __DIR__ . '/config/database.php';

try {
    $db = Database::getInstance()->getConnection();
    $host = $_ENV['DB_HOST'] ?? 'unknown';
    $port = $_ENV['DB_PORT'] ?? 'unknown';
    $dbname = $db->query('SELECT DATABASE()')->fetchColumn();
    $version = $db->query('SELECT VERSION()')->fetchColumn();
    
    echo "========================================\n";
    echo "CONNECTED SUCCESSFULLY TO AIVEN / MYSQL!\n";
    echo "Host: {$host}:{$port}\n";
    echo "Database: {$dbname}\n";
    echo "Version: {$version}\n";
    echo "========================================\n";

    $tables = $db->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);
    echo "Tables in database (" . count($tables) . "):\n";
    foreach ($tables as $table) {
        $count = $db->query("SELECT COUNT(*) FROM `{$table}`")->fetchColumn();
        echo " - {$table}: {$count} records\n";
    }
    echo "========================================\n";
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
}

<?php
/**
 * Health Check & Diagnostic Endpoint
 * GET /api/health.php
 */

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';

$response = [
    'status' => 'ok',
    'timestamp' => date('Y-m-d H:i:s'),
    'environment' => [
        'php_version' => PHP_VERSION,
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'CLI',
        'db_host' => $_ENV['DB_HOST'] ?? 'not set',
        'db_port' => $_ENV['DB_PORT'] ?? 'not set',
        'db_name' => $_ENV['DB_NAME'] ?? 'not set',
        'db_user' => $_ENV['DB_USER'] ?? 'not set',
        'db_ssl'  => $_ENV['DB_SSL'] ?? 'not set',
    ],
    'database' => [
        'connected' => false,
        'error' => null,
        'tables' => []
    ]
];

try {
    $db = Database::getInstance()->getConnection();
    $response['database']['connected'] = true;
    $response['database']['version'] = $db->query('SELECT VERSION()')->fetchColumn();
    
    $tables = $db->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);
    foreach ($tables as $t) {
        $count = $db->query("SELECT COUNT(*) FROM `{$t}`")->fetchColumn();
        $response['database']['tables'][$t] = (int)$count;
    }
} catch (Exception $e) {
    $response['status'] = 'degraded';
    $response['database']['error'] = $e->getMessage();
}

http_response_code($response['database']['connected'] ? 200 : 500);
echo json_encode($response, JSON_PRETTY_PRINT);

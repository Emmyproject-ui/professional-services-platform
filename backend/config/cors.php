<?php
/**
 * CORS Configuration
 */

function configureCORS() {
    $allowedOrigin = $_ENV['FRONTEND_URL'] ?? 'http://localhost:5173';
    
    // Handle preflight requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header("Access-Control-Allow-Origin: {$allowedOrigin}");
        header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
        header("Access-Control-Max-Age: 86400");
        header("Access-Control-Allow-Credentials: true");
        http_response_code(204);
        exit;
    }
    
    // Set CORS headers for actual requests
    header("Access-Control-Allow-Origin: {$allowedOrigin}");
    header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Credentials: true");
    header("Content-Type: application/json; charset=UTF-8");
}

configureCORS();

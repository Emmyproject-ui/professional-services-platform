<?php
/**
 * Dynamic & Robust CORS Configuration
 */

function configureCORS() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $frontendUrl = $_ENV['FRONTEND_URL'] ?? '*';

    if ($frontendUrl && $frontendUrl !== '*') {
        $allowedOrigin = $frontendUrl;
    } elseif ($origin) {
        $allowedOrigin = $origin;
    } else {
        $allowedOrigin = '*';
    }

    header("Access-Control-Allow-Origin: {$allowedOrigin}");
    header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    if ($allowedOrigin !== '*') {
        header("Access-Control-Allow-Credentials: true");
    }
    header("Content-Type: application/json; charset=UTF-8");

    // Handle OPTIONS preflight request immediately
    if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

configureCORS();

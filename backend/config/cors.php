<?php
/**
 * Dynamic & Robust CORS Configuration
 */

function configureCORS() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
    $frontendUrl = $_ENV['FRONTEND_URL'] ?? '';

    // If FRONTEND_URL is '*' or empty, echo back the request origin (allow all)
    // This is needed because credentials=true is incompatible with literal '*' origin header
    if (!$frontendUrl || $frontendUrl === '*') {
        $allowedOrigin = $origin;
    } else {
        $allowedOrigin = $frontendUrl;
    }

    header("Access-Control-Allow-Origin: {$allowedOrigin}");
    header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Credentials: true");
    header("Content-Type: application/json; charset=UTF-8");

    // Handle OPTIONS preflight request immediately
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

configureCORS();

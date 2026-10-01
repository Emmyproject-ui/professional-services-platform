<?php
/**
 * Admin Authorization Middleware
 * Requires authentication and admin role
 */

require_once __DIR__ . '/auth.php';

function requireAdmin() {
    // First authenticate the user
    $user = authenticate();
    
    // Check if user has admin role
    if ($user['role'] !== 'admin') {
        Response::forbidden('Access denied. Admin privileges required');
    }
    
    return $user;
}

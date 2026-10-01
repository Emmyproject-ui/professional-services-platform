<?php
/**
 * Authentication Middleware
 * Validates JWT token and sets authenticated user
 */

require_once __DIR__ . '/../utils/JWT.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../config/database.php';

function authenticate() {
    try {
        // Get token from Authorization header
        $token = JWT::getBearerToken();
        
        if (!$token) {
            Response::unauthorized('Authentication token is required');
        }

        // Decode and validate token
        $payload = JWT::decode($token);

        // Verify user still exists in database
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("SELECT id, name, email, role FROM users WHERE id = ?");
        $stmt->execute([$payload['user_id']]);
        $user = $stmt->fetch();

        if (!$user) {
            Response::unauthorized('User not found');
        }

        // Set authenticated user in global scope
        $GLOBALS['auth_user'] = $user;
        
        return $user;
        
    } catch (Exception $e) {
        Response::unauthorized('Invalid or expired token: ' . $e->getMessage());
    }
}

/**
 * Get authenticated user
 */
function getAuthUser() {
    return $GLOBALS['auth_user'] ?? null;
}

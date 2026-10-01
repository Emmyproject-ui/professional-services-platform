<?php
/**
 * User Login Endpoint
 * POST /api/auth/login
 */

require_once __DIR__ . '/../../config/env.php';
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Validator.php';
require_once __DIR__ . '/../../utils/JWT.php';
require_once __DIR__ . '/../../models/User.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed', 'METHOD_NOT_ALLOWED', 405);
}

try {
    // Get request body
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        Response::error('Invalid JSON input', 'INVALID_INPUT', 400);
    }

    // Validate input
    $validator = new Validator($input);
    $validator
        ->required('email')
        ->email('email')
        ->required('password');

    if ($validator->fails()) {
        Response::validationError($validator->getErrors());
    }

    $data = $validator->getData();
    $userModel = new User();

    // Find user by email
    $user = $userModel->findByEmail($data['email']);

    if (!$user) {
        Response::error('Invalid credentials', 'AUTHENTICATION_FAILED', 401);
    }

    // Verify password
    if (!$userModel->verifyPassword($data['password'], $user['password_hash'])) {
        Response::error('Invalid credentials', 'AUTHENTICATION_FAILED', 401);
    }

    // Generate JWT token
    $payload = [
        'user_id' => $user['id'],
        'email' => $user['email'],
        'role' => $user['role']
    ];
    
    $token = JWT::encode($payload);

    Response::success('Login successful', [
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role']
        ]
    ]);

} catch (Exception $e) {
    error_log("Login Error: " . $e->getMessage());
    Response::serverError('An error occurred during login');
}

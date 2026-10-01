<?php
/**
 * User Registration Endpoint
 * POST /api/auth/register
 */

require_once __DIR__ . '/../../config/env.php';
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Validator.php';
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
        ->required('name')
        ->maxLength('name', 150)
        ->required('email')
        ->email('email')
        ->required('password')
        ->minLength('password', 8, 'Password must be at least 8 characters')
        ->required('password_confirmation')
        ->matches('password_confirmation', 'password', 'Password confirmation does not match');

    if ($validator->fails()) {
        Response::validationError($validator->getErrors());
    }

    $data = $validator->getData();
    $userModel = new User();

    // Check if email already exists
    if ($userModel->emailExists($data['email'])) {
        Response::error('Email already registered', 'EMAIL_EXISTS', 422);
    }

    // SECURITY: Force role to 'customer' - users cannot register as admin
    $userId = $userModel->create(
        $data['name'],
        $data['email'],
        $data['password'],
        'customer'
    );

    // Get created user
    $user = $userModel->findById($userId);

    Response::success('Registration successful', [
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role']
        ]
    ], 201);

} catch (PDOException $e) {
    error_log("Registration Error: " . $e->getMessage());
    Response::serverError('Registration failed. Please try again');
} catch (Exception $e) {
    error_log("Registration Error: " . $e->getMessage());
    Response::serverError('An error occurred during registration');
}

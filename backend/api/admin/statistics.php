<?php
/**
 * Admin Statistics Endpoint
 * GET /api/admin/statistics - Get order statistics
 */

require_once __DIR__ . '/../../config/env.php';
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../middleware/admin.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../models/Order.php';

// Require admin authentication
$authUser = requireAdmin();

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Response::error('Method not allowed', 'METHOD_NOT_ALLOWED', 405);
}

try {
    $orderModel = new Order();
    $statistics = $orderModel->getStatistics();

    // Format response
    $formattedStats = [
        'total_orders' => (int)$statistics['total_orders'],
        'pending_orders' => (int)$statistics['pending_orders'],
        'processing_orders' => (int)$statistics['processing_orders'],
        'completed_orders' => (int)$statistics['completed_orders'],
        'cancelled_orders' => (int)$statistics['cancelled_orders']
    ];

    Response::success('Statistics retrieved successfully', $formattedStats);

} catch (Exception $e) {
    error_log("Admin Statistics Error: " . $e->getMessage());
    Response::serverError('Failed to retrieve statistics');
}

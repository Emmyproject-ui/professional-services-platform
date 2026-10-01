<?php
/**
 * Admin Orders Management Endpoint
 * GET /api/admin/orders - Get all orders with customer info
 * PATCH /api/admin/orders/{id} - Update order status
 */

require_once __DIR__ . '/../../config/env.php';
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../middleware/admin.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Validator.php';
require_once __DIR__ . '/../../models/Order.php';

// Require admin authentication
$authUser = requireAdmin();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // GET: Retrieve all orders with customer information
    try {
        $orderModel = new Order();
        $orders = $orderModel->getAllOrdersWithCustomer();

        Response::success('Orders retrieved successfully', $orders);

    } catch (Exception $e) {
        error_log("Admin Get Orders Error: " . $e->getMessage());
        Response::serverError('Failed to retrieve orders');
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
    // PATCH: Update order status
    try {
        // Get order ID from URL path
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $pathParts = explode('/', trim($path, '/'));
        $orderId = end($pathParts);

        if (!is_numeric($orderId)) {
            Response::error('Invalid order ID', 'INVALID_ORDER_ID', 400);
        }

        // Get request body
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            Response::error('Invalid JSON input', 'INVALID_INPUT', 400);
        }

        // Validate input
        $validator = new Validator($input);
        $validator->required('status');

        if ($validator->fails()) {
            Response::validationError($validator->getErrors());
        }

        $data = $validator->getData();

        // Validate status value
        $validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
        if (!in_array($data['status'], $validStatuses)) {
            Response::error(
                'Invalid status. Must be one of: ' . implode(', ', $validStatuses),
                'INVALID_STATUS',
                400
            );
        }

        // Check if order exists
        $orderModel = new Order();
        $order = $orderModel->findById($orderId);

        if (!$order) {
            Response::notFound('Order not found');
        }

        // Update order status
        $orderModel->updateStatus($orderId, $data['status']);

        // Get updated order
        $updatedOrder = $orderModel->findById($orderId);

        Response::success('Order status updated successfully', $updatedOrder);

    } catch (Exception $e) {
        error_log("Admin Update Order Error: " . $e->getMessage());
        Response::serverError('Failed to update order status');
    }

} else {
    Response::error('Method not allowed', 'METHOD_NOT_ALLOWED', 405);
}

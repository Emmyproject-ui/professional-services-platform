<?php
/**
 * Orders Endpoint
 * GET /api/orders - Get customer's own orders
 * POST /api/orders - Create new order
 */

require_once __DIR__ . '/../../config/env.php';
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Validator.php';
require_once __DIR__ . '/../../models/Order.php';
require_once __DIR__ . '/../../models/Product.php';

// Authenticate user
$authUser = authenticate();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // GET: Retrieve customer's own orders
    try {
        $orderModel = new Order();
        $orders = $orderModel->getByCustomerId($authUser['id']);

        Response::success('Orders retrieved successfully', $orders);

    } catch (Exception $e) {
        error_log("Get Orders Error: " . $e->getMessage());
        Response::serverError('Failed to retrieve orders');
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // POST: Create new order
    try {
        // Get request body
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            Response::error('Invalid JSON input', 'INVALID_INPUT', 400);
        }

        // Validate input
        $validator = new Validator($input);
        $validator
            ->required('items')
            ->required('total_amount')
            ->numeric('total_amount')
            ->min('total_amount', 0);

        if ($validator->fails()) {
            Response::validationError($validator->getErrors());
        }

        $data = $validator->getData();

        // Validate items array
        if (!is_array($data['items']) || empty($data['items'])) {
            Response::error('Order must contain at least one item', 'INVALID_ITEMS', 400);
        }

        // SECURITY: Verify prices and calculate total on server side
        $productModel = new Product();
        $calculatedTotal = 0;
        $productDetails = [];

        foreach ($data['items'] as $item) {
            if (!isset($item['product_id']) || !isset($item['quantity'])) {
                Response::error('Invalid item format', 'INVALID_ITEM_FORMAT', 400);
            }

            // Get product from database
            $product = $productModel->findById($item['product_id']);

            if (!$product) {
                Response::error("Product with ID {$item['product_id']} not found", 'PRODUCT_NOT_FOUND', 404);
            }

            if ($product['status'] !== 'active') {
                Response::error("Product {$product['title']} is not available", 'PRODUCT_UNAVAILABLE', 400);
            }

            $quantity = (int)$item['quantity'];
            if ($quantity < 1) {
                Response::error('Quantity must be at least 1', 'INVALID_QUANTITY', 400);
            }

            // Calculate line total using database price
            $lineTotal = (float)$product['price'] * $quantity;
            $calculatedTotal += $lineTotal;

            $productDetails[] = [
                'product_id' => $product['id'],
                'title' => $product['title'],
                'price' => (float)$product['price'],
                'quantity' => $quantity,
                'line_total' => $lineTotal
            ];
        }

        // Round to 2 decimal places
        $calculatedTotal = round($calculatedTotal, 2);

        // Use calculated total from server, not client-provided
        $orderModel = new Order();
        $orderId = $orderModel->create(
            $authUser['id'], // Use authenticated user's ID
            $productDetails,
            $calculatedTotal
        );

        // Get created order
        $order = $orderModel->findById($orderId);

        Response::success('Order created successfully', $order, 201);

    } catch (Exception $e) {
        error_log("Create Order Error: " . $e->getMessage());
        Response::serverError('Failed to create order');
    }

} else {
    Response::error('Method not allowed', 'METHOD_NOT_ALLOWED', 405);
}

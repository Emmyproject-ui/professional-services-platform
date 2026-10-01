<?php
/**
 * Products Endpoint (Public)
 * GET /api/products
 */

require_once __DIR__ . '/../../config/env.php';
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../models/Product.php';

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Response::error('Method not allowed', 'METHOD_NOT_ALLOWED', 405);
}

try {
    $productModel = new Product();
    $products = $productModel->getActiveProducts();

    // Format response
    $formattedProducts = array_map(function($product) {
        return [
            'id' => (int)$product['id'],
            'title' => $product['title'],
            'description' => $product['description'],
            'price' => (float)$product['price'],
            'status' => $product['status'],
            'created_at' => $product['created_at']
        ];
    }, $products);

    Response::success('Products retrieved successfully', $formattedProducts);

} catch (Exception $e) {
    error_log("Products Error: " . $e->getMessage());
    Response::serverError('Failed to retrieve products');
}

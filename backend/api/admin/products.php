<?php
/**
 * Admin Products Management Endpoint
 * GET /api/admin/products - Get all products (including inactive)
 * PUT /api/admin/products/{id} - Update product details
 */

require_once __DIR__ . '/../../config/env.php';
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../middleware/admin.php';
require_once __DIR__ . '/../../utils/Response.php';
require_once __DIR__ . '/../../utils/Validator.php';
require_once __DIR__ . '/../../models/Product.php';

// Require admin authentication
$authUser = requireAdmin();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // GET: Retrieve all products (including inactive)
    try {
        $productModel = new Product();
        $products = $productModel->getAllProducts();

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
        error_log("Admin Get Products Error: " . $e->getMessage());
        Response::serverError('Failed to retrieve products');
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // PUT: Update product details
    try {
        // Get product ID from URL path
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $pathParts = explode('/', trim($path, '/'));
        $productId = end($pathParts);

        if (!is_numeric($productId)) {
            Response::error('Invalid product ID', 'INVALID_PRODUCT_ID', 400);
        }

        // Get request body
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            Response::error('Invalid JSON input', 'INVALID_INPUT', 400);
        }

        // Validate input
        $validator = new Validator($input);
        $validator
            ->required('title')
            ->maxLength('title', 255)
            ->required('description')
            ->required('price')
            ->numeric('price')
            ->min('price', 0)
            ->required('status');

        if ($validator->fails()) {
            Response::validationError($validator->getErrors());
        }

        $data = $validator->getData();

        // Validate status value
        $validStatuses = ['active', 'inactive'];
        if (!in_array($data['status'], $validStatuses)) {
            Response::error(
                'Invalid status. Must be one of: ' . implode(', ', $validStatuses),
                'INVALID_STATUS',
                400
            );
        }

        // Check if product exists
        $productModel = new Product();
        $product = $productModel->findById($productId);

        if (!$product) {
            Response::notFound('Product not found');
        }

        // Update product
        $updated = $productModel->update($productId, [
            'title' => $data['title'],
            'description' => $data['description'],
            'price' => (float)$data['price'],
            'status' => $data['status']
        ]);

        if ($updated) {
            // Get updated product
            $updatedProduct = $productModel->findById($productId);
            
            $formattedProduct = [
                'id' => (int)$updatedProduct['id'],
                'title' => $updatedProduct['title'],
                'description' => $updatedProduct['description'],
                'price' => (float)$updatedProduct['price'],
                'status' => $updatedProduct['status'],
                'created_at' => $updatedProduct['created_at']
            ];

            Response::success('Product updated successfully', $formattedProduct);
        } else {
            Response::serverError('Failed to update product');
        }

    } catch (Exception $e) {
        error_log("Admin Update Product Error: " . $e->getMessage());
        Response::serverError('Failed to update product');
    }

} else {
    Response::error('Method not allowed', 'METHOD_NOT_ALLOWED', 405);
}
?>
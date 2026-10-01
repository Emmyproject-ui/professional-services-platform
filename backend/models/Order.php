<?php
/**
 * Order Model
 */

require_once __DIR__ . '/../config/database.php';

class Order {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    /**
     * Create new order
     */
    public function create($customerId, $productDetails, $totalAmount) {
        $stmt = $this->db->prepare(
            "INSERT INTO orders (customer_id, product_details, total_amount, status) 
             VALUES (?, ?, ?, 'pending')"
        );
        
        $productDetailsJson = json_encode($productDetails);
        $stmt->execute([$customerId, $productDetailsJson, $totalAmount]);
        
        return $this->db->lastInsertId();
    }

    /**
     * Get orders by customer ID
     */
    public function getByCustomerId($customerId) {
        $stmt = $this->db->prepare(
            "SELECT id, customer_id, product_details, total_amount, status, created_at 
             FROM orders 
             WHERE customer_id = ? 
             ORDER BY created_at DESC"
        );
        $stmt->execute([$customerId]);
        $orders = $stmt->fetchAll();
        
        // Decode JSON product_details
        foreach ($orders as &$order) {
            $order['product_details'] = json_decode($order['product_details'], true);
        }
        
        return $orders;
    }

    /**
     * Get all orders with customer information (for admin)
     */
    public function getAllOrdersWithCustomer() {
        $stmt = $this->db->prepare(
            "SELECT 
                o.id, 
                o.customer_id, 
                o.product_details, 
                o.total_amount, 
                o.status, 
                o.created_at,
                u.name as customer_name,
                u.email as customer_email
             FROM orders o
             INNER JOIN users u ON o.customer_id = u.id
             ORDER BY o.created_at DESC"
        );
        $stmt->execute();
        $orders = $stmt->fetchAll();
        
        // Decode JSON product_details
        foreach ($orders as &$order) {
            $order['product_details'] = json_decode($order['product_details'], true);
        }
        
        return $orders;
    }

    /**
     * Get order by ID
     */
    public function findById($id) {
        $stmt = $this->db->prepare(
            "SELECT id, customer_id, product_details, total_amount, status, created_at 
             FROM orders 
             WHERE id = ?"
        );
        $stmt->execute([$id]);
        $order = $stmt->fetch();
        
        if ($order) {
            $order['product_details'] = json_decode($order['product_details'], true);
        }
        
        return $order;
    }

    /**
     * Update order status
     */
    public function updateStatus($id, $status) {
        $validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
        
        if (!in_array($status, $validStatuses)) {
            throw new Exception('Invalid order status');
        }
        
        $stmt = $this->db->prepare(
            "UPDATE orders SET status = ? WHERE id = ?"
        );
        
        return $stmt->execute([$status, $id]);
    }

    /**
     * Get order statistics
     */
    public function getStatistics() {
        $stmt = $this->db->prepare(
            "SELECT 
                COUNT(*) as total_orders,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
                SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) as processing_orders,
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_orders,
                SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled_orders
             FROM orders"
        );
        $stmt->execute();
        return $stmt->fetch();
    }
}

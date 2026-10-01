<?php
/**
 * Product Model
 */

require_once __DIR__ . '/../config/database.php';

class Product {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    /**
     * Get all active products
     */
    public function getActiveProducts() {
        $stmt = $this->db->prepare(
            "SELECT id, title, description, price, status, created_at 
             FROM products 
             WHERE status = 'active' 
             ORDER BY created_at DESC"
        );
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * Get product by ID
     */
    public function findById($id) {
        $stmt = $this->db->prepare(
            "SELECT id, title, description, price, status, created_at 
             FROM products 
             WHERE id = ?"
        );
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    /**
     * Get all products (including inactive)
     */
    public function getAllProducts() {
        $stmt = $this->db->prepare(
            "SELECT id, title, description, price, status, created_at 
             FROM products 
             ORDER BY created_at DESC"
        );
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * Update product
     */
    public function update($id, $data) {
        $sql = "UPDATE products SET ";
        $fields = [];
        $params = [];
        
        foreach ($data as $field => $value) {
            $fields[] = "{$field} = ?";
            $params[] = $value;
        }
        
        $sql .= implode(', ', $fields);
        $sql .= " WHERE id = ?";
        $params[] = $id;
        
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }
}

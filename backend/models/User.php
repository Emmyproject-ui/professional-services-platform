<?php
/**
 * User Model
 */

require_once __DIR__ . '/../config/database.php';

class User {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    /**
     * Create new user
     */
    public function create($name, $email, $password, $role = 'customer') {
        // Hash password
        $passwordHash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

        $stmt = $this->db->prepare(
            "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)"
        );
        
        $stmt->execute([$name, $email, $passwordHash, $role]);
        
        return $this->db->lastInsertId();
    }

    /**
     * Find user by email
     */
    public function findByEmail($email) {
        $stmt = $this->db->prepare(
            "SELECT id, name, email, password_hash, role, created_at FROM users WHERE email = ?"
        );
        $stmt->execute([$email]);
        return $stmt->fetch();
    }

    /**
     * Find user by ID
     */
    public function findById($id) {
        $stmt = $this->db->prepare(
            "SELECT id, name, email, role, created_at FROM users WHERE id = ?"
        );
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    /**
     * Check if email exists
     */
    public function emailExists($email) {
        $stmt = $this->db->prepare("SELECT COUNT(*) as count FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $result = $stmt->fetch();
        return $result['count'] > 0;
    }

    /**
     * Verify password
     */
    public function verifyPassword($password, $passwordHash) {
        return password_verify($password, $passwordHash);
    }
}

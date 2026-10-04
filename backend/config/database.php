<?php
/**
 * Database Configuration and Connection
 */

require_once __DIR__ . '/env.php';

class Database {
    private static ?self $instance = null;
    private ?PDO $connection = null;

    private function __construct() {
        $this->connect();
    }

    private function connect() {
        try {
            $host = $_ENV['DB_HOST'] ?? getenv('DB_HOST') ?: 'localhost';
            $port = $_ENV['DB_PORT'] ?? getenv('DB_PORT') ?: '3306';
            $dbname = $_ENV['DB_NAME'] ?? getenv('DB_NAME') ?: 'project_database';
            $username = $_ENV['DB_USER'] ?? getenv('DB_USER') ?: 'root';
            $password = $_ENV['DB_PASSWORD'] ?? getenv('DB_PASSWORD') ?: '';
            $useSSL = filter_var($_ENV['DB_SSL'] ?? getenv('DB_SSL') ?: 'false', FILTER_VALIDATE_BOOLEAN);


            $dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";

            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4",
            ];

            // Enable SSL if required (e.g. Aiven cloud databases)
            if ($useSSL) {
                $options[PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT] = false;
                if (file_exists('/etc/ssl/certs/ca-certificates.crt')) {
                    $options[PDO::MYSQL_ATTR_SSL_CA] = '/etc/ssl/certs/ca-certificates.crt';
                }
            }

            $this->connection = new PDO($dsn, $username, $password, $options);

        } catch (PDOException $e) {
            error_log("Database Connection Error: " . $e->getMessage());

            // Only send HTTP response when running as a web request, not CLI
            if (php_sapi_name() !== 'cli') {
                http_response_code(500);
                header('Content-Type: application/json');
                echo json_encode([
                    'success' => false,
                    'message' => 'Database connection failed: ' . $e->getMessage(),
                    'error'   => 'DATABASE_CONNECTION_ERROR'
                ]);
                exit;
            }

            // For CLI (init_db, create_admin), throw so callers can handle it
            throw new \RuntimeException('Database connection failed: ' . $e->getMessage(), 0, $e);
        }
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection() {
        return $this->connection;
    }

    private function __clone() {}

    public function __wakeup() {
        throw new Exception("Cannot unserialize singleton");
    }
}

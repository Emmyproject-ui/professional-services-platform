<?php
/**
 * Environment Configuration Loader
 */

function loadEnv($path) {
    if (!file_exists($path)) {
        return;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    
    foreach ($lines as $line) {
        // Skip comments
        if (strpos(trim($line), '#') === 0) {
            continue;
        }

        // Parse key=value pairs
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);
            
            // Remove quotes if present
            $value = trim($value, '"\'');
            
            // Set environment variable
            if (!array_key_exists($key, $_ENV)) {
                $_ENV[$key] = $value;
                putenv("{$key}={$value}");
            }
        }
    }
}

// Also copy existing system environment variables (from Docker/Render) into $_ENV
foreach (['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_SSL', 'JWT_SECRET', 'JWT_EXPIRATION', 'FRONTEND_URL', 'ADMIN_EMAIL', 'ADMIN_PASSWORD', 'ADMIN_NAME'] as $var) {
    $val = getenv($var);
    if ($val !== false && !isset($_ENV[$var])) {
        $_ENV[$var] = $val;
    }
}

// Load .env file (for local development)
loadEnv(__DIR__ . '/../.env');


<?php
/**
 * Environment Configuration Loader
 * Priority: .env file > system environment variables
 * This ensures our baked-in / start.sh-written values always win,
 * even if Render has stale / wrong env vars set in its dashboard.
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
            
            // Remove surrounding quotes if present
            $value = trim($value, "\"'");
            
            // .env file ALWAYS wins — overwrite whatever is in $_ENV / getenv
            $_ENV[$key] = $value;
            putenv("{$key}={$value}");
        }
    }
}

// Step 1: seed $_ENV from system environment (Render / Docker env vars)
foreach (['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_SSL',
          'JWT_SECRET', 'JWT_EXPIRATION', 'FRONTEND_URL',
          'ADMIN_EMAIL', 'ADMIN_PASSWORD', 'ADMIN_NAME'] as $var) {
    $val = getenv($var);
    if ($val !== false) {
        $_ENV[$var] = $val;
    }
}

// Step 2: load .env file — OVERWRITES system env vars so the file always wins.
// start.sh writes the correct Aiven credentials into /var/www/backend/.env
// at container boot, so this always reflects the true production config.
loadEnv(__DIR__ . '/../.env');

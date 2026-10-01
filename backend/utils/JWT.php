<?php
/**
 * JWT Utility Class
 * Simple JWT implementation for authentication
 */

class JWT {
    private static function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode($data) {
        return base64_decode(strtr($data, '-_', '+/'));
    }

    /**
     * Generate JWT token
     */
    public static function encode($payload, $secret = null) {
        if ($secret === null) {
            $secret = $_ENV['JWT_SECRET'] ?? 'default_secret_change_this';
        }

        $header = [
            'typ' => 'JWT',
            'alg' => 'HS256'
        ];

        // Add expiration to payload
        $expiration = $_ENV['JWT_EXPIRATION'] ?? 86400; // 24 hours default
        $payload['iat'] = time();
        $payload['exp'] = time() + (int)$expiration;

        $headerEncoded = self::base64UrlEncode(json_encode($header));
        $payloadEncoded = self::base64UrlEncode(json_encode($payload));

        $signature = hash_hmac(
            'sha256',
            "{$headerEncoded}.{$payloadEncoded}",
            $secret,
            true
        );
        $signatureEncoded = self::base64UrlEncode($signature);

        return "{$headerEncoded}.{$payloadEncoded}.{$signatureEncoded}";
    }

    /**
     * Decode and validate JWT token
     */
    public static function decode($token, $secret = null) {
        if ($secret === null) {
            $secret = $_ENV['JWT_SECRET'] ?? 'default_secret_change_this';
        }

        $parts = explode('.', $token);
        
        if (count($parts) !== 3) {
            throw new Exception('Invalid token format');
        }

        list($headerEncoded, $payloadEncoded, $signatureEncoded) = $parts;

        // Verify signature
        $signature = self::base64UrlDecode($signatureEncoded);
        $expectedSignature = hash_hmac(
            'sha256',
            "{$headerEncoded}.{$payloadEncoded}",
            $secret,
            true
        );

        if (!hash_equals($signature, $expectedSignature)) {
            throw new Exception('Invalid token signature');
        }

        // Decode payload
        $payload = json_decode(self::base64UrlDecode($payloadEncoded), true);

        if (!$payload) {
            throw new Exception('Invalid token payload');
        }

        // Check expiration
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            throw new Exception('Token has expired');
        }

        return $payload;
    }

    /**
     * Extract token from Authorization header
     */
    public static function getBearerToken() {
        $headers = getallheaders();
        
        if (isset($headers['Authorization'])) {
            $matches = [];
            if (preg_match('/Bearer\s+(.*)$/i', $headers['Authorization'], $matches)) {
                return $matches[1];
            }
        }
        
        return null;
    }
}

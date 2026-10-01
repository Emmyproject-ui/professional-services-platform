<?php
/**
 * Standardized API Response Utility
 */

class Response {
    /**
     * Send success response
     */
    public static function success($message = 'Operation successful', $data = null, $statusCode = 200) {
        http_response_code($statusCode);
        
        $response = [
            'success' => true,
            'message' => $message
        ];
        
        if ($data !== null) {
            $response['data'] = $data;
        }
        
        echo json_encode($response);
        exit;
    }

    /**
     * Send error response
     */
    public static function error($message = 'Operation failed', $errorCode = 'ERROR', $statusCode = 400, $details = null) {
        http_response_code($statusCode);
        
        $response = [
            'success' => false,
            'message' => $message,
            'error' => $errorCode
        ];
        
        if ($details !== null) {
            $response['details'] = $details;
        }
        
        echo json_encode($response);
        exit;
    }

    /**
     * Send validation error response
     */
    public static function validationError($errors, $message = 'Validation failed') {
        self::error($message, 'VALIDATION_ERROR', 422, $errors);
    }

    /**
     * Send unauthorized response
     */
    public static function unauthorized($message = 'Unauthorized access') {
        self::error($message, 'UNAUTHORIZED', 401);
    }

    /**
     * Send forbidden response
     */
    public static function forbidden($message = 'Access forbidden') {
        self::error($message, 'FORBIDDEN', 403);
    }

    /**
     * Send not found response
     */
    public static function notFound($message = 'Resource not found') {
        self::error($message, 'NOT_FOUND', 404);
    }

    /**
     * Send internal server error response
     */
    public static function serverError($message = 'Internal server error') {
        self::error($message, 'INTERNAL_SERVER_ERROR', 500);
    }
}

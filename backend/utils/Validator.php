<?php
/**
 * Input Validation Utility
 */

class Validator {
    private $errors = [];
    private $data;

    public function __construct($data) {
        $this->data = $data;
    }

    /**
     * Validate required field
     */
    public function required($field, $message = null) {
        if (!isset($this->data[$field])) {
            $this->errors[$field] = $message ?? "{$field} is required";
        } else if (is_array($this->data[$field])) {
            // For arrays, check if empty
            if (empty($this->data[$field])) {
                $this->errors[$field] = $message ?? "{$field} is required";
            }
        } else if (trim($this->data[$field]) === '') {
            // For strings, check if empty after trimming
            $this->errors[$field] = $message ?? "{$field} is required";
        }
        return $this;
    }

    /**
     * Validate email format
     */
    public function email($field, $message = null) {
        if (isset($this->data[$field]) && !filter_var($this->data[$field], FILTER_VALIDATE_EMAIL)) {
            $this->errors[$field] = $message ?? "Invalid email format";
        }
        return $this;
    }

    /**
     * Validate minimum length
     */
    public function minLength($field, $length, $message = null) {
        if (isset($this->data[$field]) && strlen($this->data[$field]) < $length) {
            $this->errors[$field] = $message ?? "{$field} must be at least {$length} characters";
        }
        return $this;
    }

    /**
     * Validate maximum length
     */
    public function maxLength($field, $length, $message = null) {
        if (isset($this->data[$field]) && strlen($this->data[$field]) > $length) {
            $this->errors[$field] = $message ?? "{$field} must not exceed {$length} characters";
        }
        return $this;
    }

    /**
     * Validate field matches another field
     */
    public function matches($field, $matchField, $message = null) {
        if (isset($this->data[$field]) && isset($this->data[$matchField]) && 
            $this->data[$field] !== $this->data[$matchField]) {
            $this->errors[$field] = $message ?? "{$field} does not match {$matchField}";
        }
        return $this;
    }

    /**
     * Validate numeric value
     */
    public function numeric($field, $message = null) {
        if (isset($this->data[$field]) && !is_numeric($this->data[$field])) {
            $this->errors[$field] = $message ?? "{$field} must be numeric";
        }
        return $this;
    }

    /**
     * Validate minimum value
     */
    public function min($field, $min, $message = null) {
        if (isset($this->data[$field]) && $this->data[$field] < $min) {
            $this->errors[$field] = $message ?? "{$field} must be at least {$min}";
        }
        return $this;
    }

    /**
     * Check if validation passed
     */
    public function passes() {
        return empty($this->errors);
    }

    /**
     * Check if validation failed
     */
    public function fails() {
        return !$this->passes();
    }

    /**
     * Get validation errors
     */
    public function getErrors() {
        return $this->errors;
    }

    /**
     * Get validated data
     */
    public function getData() {
        return $this->data;
    }
}

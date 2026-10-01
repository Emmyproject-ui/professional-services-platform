# API Testing Guide

This guide provides cURL commands and examples for testing all API endpoints.

## Prerequisites

- Backend server running on `http://localhost:8000`
- Database properly setup with sample data
- Admin user created

## Base URL

```
http://localhost:8000/api
```

## Testing Authentication

### 1. Register New Customer

```bash
curl -X POST http://localhost:8000/api/auth/register.php \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John Doe\",\"email\":\"john@test.com\",\"password\":\"password123\",\"password_confirmation\":\"password123\"}"
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": 2,
      "name": "John Doe",
      "email": "john@test.com",
      "role": "customer"
    }
  }
}
```

### 2. Login as Customer

```bash
curl -X POST http://localhost:8000/api/auth/login.php \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"john@test.com\",\"password\":\"password123\"}"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {
      "id": 2,
      "name": "John Doe",
      "email": "john@test.com",
      "role": "customer"
    }
  }
}
```

**Save the token for subsequent requests!**

### 3. Login as Admin

```bash
curl -X POST http://localhost:8000/api/auth/login.php \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@example.com\",\"password\":\"Admin@12345\"}"
```

**Save the admin token separately!**

## Testing Products API

### 4. Get All Active Products (Public)

```bash
curl http://localhost:8000/api/products/index.php
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Website Development",
      "description": "Professional website development service with modern technologies",
      "price": 150000,
      "status": "active",
      "created_at": "2024-01-01 10:00:00"
    },
    {
      "id": 2,
      "title": "Mobile App Development",
      "description": "Native and cross-platform mobile application development",
      "price": 200000,
      "status": "active",
      "created_at": "2024-01-01 10:00:00"
    }
  ]
}
```

## Testing Orders API (Customer)

**Note:** Replace `<CUSTOMER_TOKEN>` with the token from step 2.

### 5. Create New Order

```bash
curl -X POST http://localhost:8000/api/orders/index.php \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <CUSTOMER_TOKEN>" \
  -d "{\"items\":[{\"product_id\":1,\"quantity\":2},{\"product_id\":2,\"quantity\":1}],\"total_amount\":500000}"
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "customer_id": 2,
    "product_details": [
      {
        "product_id": 1,
        "title": "Website Development",
        "price": 150000,
        "quantity": 2,
        "line_total": 300000
      },
      {
        "product_id": 2,
        "title": "Mobile App Development",
        "price": 200000,
        "quantity": 1,
        "line_total": 200000
      }
    ],
    "total_amount": 500000,
    "status": "pending",
    "created_at": "2024-01-01 12:00:00"
  }
}
```

**Note:** The server recalculates the total_amount based on database prices, ignoring the client-provided value.

### 6. Get Customer's Orders

```bash
curl http://localhost:8000/api/orders/index.php \
  -H "Authorization: Bearer <CUSTOMER_TOKEN>"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": [
    {
      "id": 1,
      "customer_id": 2,
      "product_details": [...],
      "total_amount": 500000,
      "status": "pending",
      "created_at": "2024-01-01 12:00:00"
    }
  ]
}
```

## Testing Admin API

**Note:** Replace `<ADMIN_TOKEN>` with the token from step 3.

### 7. Get All Orders (Admin)

```bash
curl http://localhost:8000/api/admin/orders.php \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": [
    {
      "id": 1,
      "customer_id": 2,
      "customer_name": "John Doe",
      "customer_email": "john@test.com",
      "product_details": [...],
      "total_amount": 500000,
      "status": "pending",
      "created_at": "2024-01-01 12:00:00"
    }
  ]
}
```

### 8. Get Order Statistics

```bash
curl http://localhost:8000/api/admin/statistics.php \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "total_orders": 5,
    "pending_orders": 2,
    "processing_orders": 1,
    "completed_orders": 2,
    "cancelled_orders": 0
  }
}
```

### 9. Update Order Status

```bash
curl -X PATCH http://localhost:8000/api/admin/orders.php/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d "{\"status\":\"processing\"}"
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "id": 1,
    "customer_id": 2,
    "product_details": [...],
    "total_amount": 500000,
    "status": "processing",
    "created_at": "2024-01-01 12:00:00"
  }
}
```

## Testing Authorization

### 10. Test Unauthorized Access

```bash
# Try to access protected endpoint without token
curl http://localhost:8000/api/orders/index.php
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Authentication token is required",
  "error": "UNAUTHORIZED"
}
```

### 11. Test Customer Accessing Admin Endpoint

```bash
# Try to access admin endpoint with customer token
curl http://localhost:8000/api/admin/orders.php \
  -H "Authorization: Bearer <CUSTOMER_TOKEN>"
```

**Expected Response (403):**
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required",
  "error": "FORBIDDEN"
}
```

### 12. Test Invalid Token

```bash
curl http://localhost:8000/api/orders/index.php \
  -H "Authorization: Bearer invalid_token_here"
```

**Expected Response (401):**
```json
{
  "success": false,
  "message": "Invalid or expired token: ...",
  "error": "UNAUTHORIZED"
}
```

## Testing Validation

### 13. Test Registration with Missing Fields

```bash
curl -X POST http://localhost:8000/api/auth/register.php \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@test.com\",\"password\":\"123\"}"
```

**Expected Response (422):**
```json
{
  "success": false,
  "message": "Validation failed",
  "error": "VALIDATION_ERROR",
  "details": {
    "name": "name is required",
    "password": "Password must be at least 8 characters",
    "password_confirmation": "password_confirmation is required"
  }
}
```

### 14. Test Order with Invalid Product

```bash
curl -X POST http://localhost:8000/api/orders/index.php \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <CUSTOMER_TOKEN>" \
  -d "{\"items\":[{\"product_id\":999,\"quantity\":1}],\"total_amount\":100000}"
```

**Expected Response (404):**
```json
{
  "success": false,
  "message": "Product with ID 999 not found",
  "error": "PRODUCT_NOT_FOUND"
}
```

### 15. Test Update with Invalid Status

```bash
curl -X PATCH http://localhost:8000/api/admin/orders.php/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d "{\"status\":\"invalid_status\"}"
```

**Expected Response (400):**
```json
{
  "success": false,
  "message": "Invalid status. Must be one of: pending, processing, completed, cancelled",
  "error": "INVALID_STATUS"
}
```

## Testing Security Features

### 16. Test Price Manipulation Prevention

```bash
# Try to create order with fake low price
curl -X POST http://localhost:8000/api/orders/index.php \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <CUSTOMER_TOKEN>" \
  -d "{\"items\":[{\"product_id\":1,\"quantity\":1}],\"total_amount\":1}"
```

**Expected:** Server recalculates and uses correct price (150000), not the fake price (1)

### 17. Test Admin Registration Prevention

```bash
# Try to register as admin (should be forced to customer)
curl -X POST http://localhost:8000/api/auth/register.php \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Fake Admin\",\"email\":\"fake@admin.com\",\"password\":\"password123\",\"password_confirmation\":\"password123\",\"role\":\"admin\"}"
```

**Expected:** User created with role "customer" regardless of role parameter

## PowerShell Examples

For Windows PowerShell, use these formats:

### Login
```powershell
$body = @{
    email = "john@test.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/auth/login.php" -Method Post -Body $body -ContentType "application/json"
```

### Get Products
```powershell
Invoke-RestMethod -Uri "http://localhost:8000/api/products/index.php"
```

### Create Order (with token)
```powershell
$token = "your_token_here"
$headers = @{
    Authorization = "Bearer $token"
}
$body = @{
    items = @(
        @{ product_id = 1; quantity = 2 }
    )
    total_amount = 300000
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/orders/index.php" -Method Post -Headers $headers -Body $body -ContentType "application/json"
```

## Postman Collection

You can also import these into Postman:

1. Create a new collection
2. Add requests for each endpoint
3. Use variables:
   - `{{base_url}}` = http://localhost:8000/api
   - `{{customer_token}}` = (from login response)
   - `{{admin_token}}` = (from admin login)

## Testing Checklist

- [ ] Customer registration works
- [ ] Customer login works and returns token
- [ ] Admin login works and returns token
- [ ] Products can be retrieved without authentication
- [ ] Customer can create orders
- [ ] Customer can view own orders
- [ ] Customer cannot access admin endpoints (403)
- [ ] Admin can view all orders with customer info
- [ ] Admin can update order status
- [ ] Admin can view statistics
- [ ] Unauthenticated requests to protected endpoints fail (401)
- [ ] Invalid tokens are rejected (401)
- [ ] Validation errors return 422 with details
- [ ] Server recalculates order totals (security check)
- [ ] Users cannot register as admin

## Error Status Codes Reference

- **200** - Success
- **201** - Created (successful registration/order)
- **400** - Bad Request (invalid input)
- **401** - Unauthorized (missing/invalid token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found (resource doesn't exist)
- **422** - Validation Error (input validation failed)
- **500** - Internal Server Error

## Notes

- All POST/PATCH requests require `Content-Type: application/json` header
- Protected endpoints require `Authorization: Bearer <token>` header
- Tokens expire after 24 hours (configurable via JWT_EXPIRATION)
- All responses follow the standard format with `success`, `message`, `data/error`

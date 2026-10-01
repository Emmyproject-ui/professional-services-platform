# Professional Services Platform - Full-Stack Application

A complete, functional full-stack web application built with React.js, PHP, and MySQL featuring JWT authentication, role-based access control (RBAC), and order management system.

## 🚀 Features

### Frontend (React.js)
- **Modern UI/UX**: Responsive design for mobile, tablet, and desktop
- **React Router**: Client-side routing with protected routes
- **Authentication**: JWT-based authentication with secure token management
- **Role-Based Access**: Separate interfaces for customers and administrators
- **Product Catalogue**: Browse and select professional services
- **Order System**: Complete checkout and order tracking functionality
- **Admin Dashboard**: Real-time order management and statistics

### Backend (PHP 8+)
- **RESTful API**: Clean API architecture with proper HTTP methods
- **JWT Authentication**: Secure token-based authentication
- **RBAC**: Role-based access control (customer/admin)
- **MySQL Database**: Relational database with proper indexing
- **Security**: PDO prepared statements, password hashing, input validation
- **CORS**: Properly configured cross-origin resource sharing

## 📋 Requirements

- PHP 8.0 or higher
- MySQL 5.7 or higher
- Node.js 16+ and npm
- Web server (Apache/Nginx) or PHP built-in server
- Composer (optional, not required for this project)

## 🗂️ Project Structure

```
project/
├── frontend/              # React.js application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── layouts/       # Layout components
│   │   ├── services/      # API services
│   │   ├── context/       # React context (Auth)
│   │   ├── routes/        # Route protection components
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── backend/               # PHP API
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── products/      # Products endpoints
│   │   ├── orders/        # Orders endpoints
│   │   └── admin/         # Admin endpoints
│   ├── config/            # Configuration files
│   ├── middleware/        # Authentication & authorization
│   ├── models/            # Database models
│   ├── utils/             # Utility classes
│   └── .env               # Environment variables
│
└── database/              # Database schema
    └── schema.sql         # Database setup script
```

## 🛠️ Setup Instructions

### 1. Database Setup

**Step 1:** Create MySQL database
```bash
mysql -u root -p
```

**Step 2:** Import the database schema
```bash
mysql -u root -p < project/database/schema.sql
```

Or manually:
```sql
source /path/to/project/database/schema.sql;
```

This will:
- Create the `project_database` database
- Create users, products, and orders tables
- Insert sample product data

### 2. Backend Setup

**Step 1:** Navigate to the backend directory
```bash
cd project/backend
```

**Step 2:** Create environment configuration
```bash
copy .env.example .env    # Windows
# or
cp .env.example .env      # Linux/Mac
```

**Step 3:** Edit `.env` file with your settings
```env
DB_HOST=localhost
DB_NAME=project_database
DB_USER=root
DB_PASSWORD=your_mysql_password

JWT_SECRET=your_secure_random_string_here
JWT_EXPIRATION=86400

FRONTEND_URL=http://localhost:5173

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=SecureAdmin@123
ADMIN_NAME=System Administrator
```

**Important:** Change `JWT_SECRET` to a secure random string!

**Step 4:** Create the admin user
```bash
php utils/create_admin.php
```

This will create the initial admin account using credentials from `.env`.

**Step 5:** Start the PHP development server
```bash
# From the backend directory
php -S localhost:8000
```

Or configure your web server (Apache/Nginx) to serve the backend directory.

### 3. Frontend Setup

**Step 1:** Navigate to the frontend directory
```bash
cd project/frontend
```

**Step 2:** Install dependencies
```bash
npm install
```

**Step 3:** Create environment configuration
```bash
copy .env.example .env    # Windows
# or
cp .env.example .env      # Linux/Mac
```

**Step 4:** Edit `.env` file
```env
VITE_API_URL=http://localhost:8000/api
```

**Note:** Adjust the URL based on your backend server configuration.

**Step 5:** Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🧪 Testing the Application

### 1. Customer Flow

**Step 1:** Open the application
```
http://localhost:5173
```

**Step 2:** Register a new customer account
- Click "Register"
- Fill in the registration form
- Submit

**Step 3:** Login with customer credentials
- Email: (your registered email)
- Password: (your password)

**Step 4:** Browse services
- Navigate to "Services"
- Select desired services
- Adjust quantities

**Step 5:** Place an order
- Click "Proceed to Checkout"
- Review order details
- Click "Place Order"

**Step 6:** View order history
- Navigate to "My Orders"
- See all your orders with current status

### 2. Admin Flow

**Step 1:** Login as administrator
- Email: admin@example.com (or your configured email)
- Password: SecureAdmin@123 (or your configured password)

**Step 2:** Access Admin Dashboard
- Automatically redirected to `/admin`
- View order statistics

**Step 3:** Manage orders
- See all customer orders
- View customer information
- Change order status using dropdown
- Confirm status changes

### 3. Security Testing

**Test 1:** Customer attempting to access admin
- Login as customer
- Try to navigate to `/admin`
- Should redirect to `/orders`

**Test 2:** Unauthenticated access
- Logout
- Try to access `/orders` or `/admin`
- Should redirect to `/login`

**Test 3:** API authorization
```bash
# Try to access admin endpoint without token
curl http://localhost:8000/api/admin/orders.php

# Response: 401 Unauthorized

# Try with customer token
curl -H "Authorization: Bearer <customer_token>" \
     http://localhost:8000/api/admin/orders.php

# Response: 403 Forbidden
```

## 📡 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new customer account.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    }
  }
}
```

#### POST /api/auth/login
Authenticate and receive JWT token.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    }
  }
}
```

**Error (401):**
```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": "AUTHENTICATION_FAILED"
}
```

### Product Endpoints

#### GET /api/products
Get all active products/services (public).

**Headers:** None required

**Response (200):**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Website Development",
      "description": "Professional website development service",
      "price": 150000.00,
      "status": "active",
      "created_at": "2024-01-01 10:00:00"
    }
  ]
}
```

### Order Endpoints

#### POST /api/orders
Create a new order (authenticated customers only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ],
  "total_amount": 300000.00
}
```

**Note:** Server validates prices and recalculates total amount.

**Response (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "customer_id": 1,
    "product_details": [...],
    "total_amount": 300000.00,
    "status": "pending",
    "created_at": "2024-01-01 12:00:00"
  }
}
```

#### GET /api/orders
Get authenticated customer's orders.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": [
    {
      "id": 1,
      "customer_id": 1,
      "product_details": [
        {
          "product_id": 1,
          "title": "Website Development",
          "price": 150000.00,
          "quantity": 2,
          "line_total": 300000.00
        }
      ],
      "total_amount": 300000.00,
      "status": "pending",
      "created_at": "2024-01-01 12:00:00"
    }
  ]
}
```

### Admin Endpoints

#### GET /api/admin/orders
Get all orders with customer information (admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": [
    {
      "id": 1,
      "customer_id": 1,
      "customer_name": "John Doe",
      "customer_email": "john@example.com",
      "product_details": [...],
      "total_amount": 300000.00,
      "status": "pending",
      "created_at": "2024-01-01 12:00:00"
    }
  ]
}
```

**Error (403):**
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required",
  "error": "FORBIDDEN"
}
```

#### PATCH /api/admin/orders/{id}
Update order status (admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request:**
```json
{
  "status": "processing"
}
```

**Valid statuses:** pending, processing, completed, cancelled

**Response (200):**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "id": 1,
    "customer_id": 1,
    "product_details": [...],
    "total_amount": 300000.00,
    "status": "processing",
    "created_at": "2024-01-01 12:00:00"
  }
}
```

#### GET /api/admin/statistics
Get order statistics (admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "total_orders": 100,
    "pending_orders": 20,
    "processing_orders": 30,
    "completed_orders": 45,
    "cancelled_orders": 5
  }
}
```

## 🔒 Security Features

### Backend Security
- ✅ PDO prepared statements (prevents SQL injection)
- ✅ Password hashing with bcrypt
- ✅ JWT token validation
- ✅ Token expiration (24 hours default)
- ✅ Input validation
- ✅ Server-side price verification
- ✅ CORS restrictions
- ✅ Role-based access control
- ✅ Customer ID verification from JWT (prevents order tampering)
- ✅ Environment variables for sensitive data

### Frontend Security
- ✅ Token storage in localStorage
- ✅ Automatic token attachment to requests
- ✅ Route protection (Public/Protected/Admin)
- ✅ Automatic redirect on 401/403
- ✅ XSS prevention through React's default escaping

### Authorization Matrix

| Endpoint | Public | Customer | Admin |
|----------|--------|----------|-------|
| GET /api/products | ✅ | ✅ | ✅ |
| POST /api/auth/register | ✅ | ❌ | ❌ |
| POST /api/auth/login | ✅ | ✅ | ✅ |
| POST /api/orders | ❌ | ✅ | ❌ |
| GET /api/orders | ❌ | ✅ (own only) | ❌ |
| GET /api/admin/orders | ❌ | ❌ | ✅ |
| PATCH /api/admin/orders/{id} | ❌ | ❌ | ✅ |
| GET /api/admin/statistics | ❌ | ❌ | ✅ |

## 🌐 CORS Configuration

CORS is configured in `backend/config/cors.php`:

```php
$allowedOrigin = $_ENV['FRONTEND_URL'] ?? 'http://localhost:5173';
```

For production, update the `FRONTEND_URL` in backend `.env`:
```env
FRONTEND_URL=https://yourdomain.com
```

## 📝 Environment Variables

### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_NAME=project_database
DB_USER=root
DB_PASSWORD=

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRATION=86400

# CORS
FRONTEND_URL=http://localhost:5173

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=SecureAdmin@123
ADMIN_NAME=System Administrator
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
```

## 🚀 Production Deployment

### Backend
1. Use a production web server (Apache/Nginx)
2. Enable HTTPS
3. Change JWT_SECRET to a strong random string
4. Update database credentials
5. Set appropriate file permissions
6. Disable error display in production
7. Update FRONTEND_URL to production domain

### Frontend
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Serve the `dist` folder with a web server
3. Update VITE_API_URL to production API URL
4. Enable HTTPS
5. Configure proper caching headers

## 🐛 Troubleshooting

### Issue: CORS errors
**Solution:** Verify `FRONTEND_URL` in backend `.env` matches your frontend URL

### Issue: Database connection failed
**Solution:** Check database credentials in backend `.env` and ensure MySQL is running

### Issue: 401 Unauthorized on protected routes
**Solution:** Check if token is valid and not expired. Try logging in again.

### Issue: Admin creation fails
**Solution:** Ensure database is properly setup and `.env` credentials are correct

### Issue: Cannot register as admin
**Solution:** This is by design. Admin accounts must be created via `create_admin.php` script

## 📄 License

This project is provided as-is for educational and commercial purposes.

## 👨‍💻 Support

For issues or questions, please refer to this documentation or check:
- PHP error logs
- Browser console for frontend errors
- Network tab for API request/response details
- MySQL error logs for database issues

# Quick Setup Guide

This guide provides step-by-step instructions to get the application running locally.

## Prerequisites Checklist

Before starting, ensure you have:
- [ ] PHP 8.0 or higher installed
- [ ] MySQL 5.7 or higher installed
- [ ] Node.js 16+ and npm installed
- [ ] A web server (Apache with XAMPP or PHP built-in server)

## Step-by-Step Setup

### Part 1: Database Setup (5 minutes)

**1. Start MySQL**
```bash
# If using XAMPP, start MySQL from XAMPP Control Panel
# Or start MySQL service
```

**2. Create and import database**

Open MySQL command line or phpMyAdmin:

```bash
# Via command line
mysql -u root -p

# Then run:
source C:/xampp/htdocs/semester 3/project/database/schema.sql;
```

Or via phpMyAdmin:
- Click "Import"
- Choose `project/database/schema.sql`
- Click "Go"

**3. Verify database creation**
```sql
USE project_database;
SHOW TABLES;
-- Should show: users, products, orders
```

### Part 2: Backend Setup (5 minutes)

**1. Navigate to backend directory**
```bash
cd "C:/xampp/htdocs/semester 3/project/backend"
```

**2. Create .env file**
```bash
# Copy the example file
copy .env.example .env
```

**3. Edit .env file**

Open `.env` in a text editor and update:

```env
DB_HOST=localhost
DB_NAME=project_database
DB_USER=root
DB_PASSWORD=            # Leave empty if no password, or enter your MySQL password

JWT_SECRET=my_super_secret_jwt_key_change_this_in_production_2024
JWT_EXPIRATION=86400

FRONTEND_URL=http://localhost:5173

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@12345
ADMIN_NAME=System Administrator
```

**Important:** Save the file after editing!

**4. Create admin user**
```bash
php utils/create_admin.php
```

You should see:
```
Admin user created successfully!
--------------------------------
ID: 1
Name: System Administrator
Email: admin@example.com
Password: Admin@12345
Role: admin
```

**5. Start PHP server**
```bash
# Make sure you're in the backend directory
php -S localhost:8000
```

Keep this terminal window open!

**6. Test backend**

Open a new terminal and test:
```bash
curl http://localhost:8000/api/products/index.php
```

You should see JSON response with products.

### Part 3: Frontend Setup (5 minutes)

**1. Open a NEW terminal/command prompt**

**2. Navigate to frontend directory**
```bash
cd "C:/xampp/htdocs/semester 3/project/frontend"
```

**3. Install dependencies**
```bash
npm install
```

This will take 1-2 minutes.

**4. Create .env file**
```bash
copy .env.example .env
```

**5. Edit .env file**

Open `.env` in a text editor:

```env
VITE_API_URL=http://localhost:8000/api
```

Save the file!

**6. Start development server**
```bash
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Part 4: Test the Application (5 minutes)

**1. Open your browser**
```
http://localhost:5173
```

**2. Test Customer Registration**
- Click "Register"
- Fill in the form:
  - Name: Test Customer
  - Email: customer@test.com
  - Password: password123
  - Confirm Password: password123
- Click "Register"
- You should see "Registration successful!"

**3. Test Customer Login**
- Click "Login here"
- Email: customer@test.com
- Password: password123
- Click "Login"
- You should be redirected to the services page

**4. Test Order Creation**
- Click "Services" in navigation
- Click "Select Service" on any service
- Adjust quantity using + / - buttons
- Click "Proceed to Checkout"
- Review order details
- Click "Place Order"
- You should see "Order placed successfully!"

**5. Test Order History**
- Click "My Orders" in navigation
- You should see your order with "Pending" status

**6. Test Admin Login**
- Click "Logout"
- Click "Login"
- Email: admin@example.com
- Password: Admin@12345 (or what you set in .env)
- Click "Login"
- You should be redirected to Admin Dashboard

**7. Test Admin Order Management**
- You should see statistics cards at the top
- Scroll down to see the orders table
- Find your test order
- Change status using the dropdown (e.g., to "Processing")
- Confirm the change
- Status should update immediately

**8. Test Admin Protection**
- Logout from admin
- Login as customer (customer@test.com)
- Try to visit: http://localhost:5173/admin
- You should be redirected to /orders

## Verification Checklist

After setup, verify:
- [ ] Backend server running on http://localhost:8000
- [ ] Frontend server running on http://localhost:5173
- [ ] Database has users, products, orders tables
- [ ] Can register new customer
- [ ] Can login as customer
- [ ] Can view products
- [ ] Can place order
- [ ] Can view order history
- [ ] Can login as admin
- [ ] Can see admin dashboard with statistics
- [ ] Can update order status as admin
- [ ] Customer cannot access /admin route

## Common Issues and Solutions

### Issue 1: "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org/

### Issue 2: "php: command not found"
**Solution:** 
- Windows: Add PHP to PATH or use XAMPP's PHP
- Make sure PHP is installed

### Issue 3: Database connection failed
**Solution:**
1. Check MySQL is running
2. Verify DB_PASSWORD in backend/.env
3. Test connection: `mysql -u root -p`

### Issue 4: CORS errors in browser console
**Solution:**
1. Verify backend/.env has: `FRONTEND_URL=http://localhost:5173`
2. Restart PHP server after changing .env

### Issue 5: "Port 8000 already in use"
**Solution:**
```bash
# Use a different port
php -S localhost:8001

# Update frontend/.env
VITE_API_URL=http://localhost:8001/api

# Restart frontend server
```

### Issue 6: "Port 5173 already in use"
**Solution:**
```bash
# Vite will automatically try port 5174, 5175, etc.
# Just use the port shown in the terminal
```

### Issue 7: Admin creation fails
**Solution:**
1. Make sure database is imported
2. Check backend/.env has correct DB credentials
3. Run: `php utils/create_admin.php` from backend directory

### Issue 8: Can't login
**Solution:**
1. Clear browser localStorage
2. Check browser console for errors
3. Verify backend is running
4. Test API: `curl http://localhost:8000/api/auth/login.php`

## File Locations Reference

```
C:/xampp/htdocs/semester 3/project/
├── backend/
│   ├── .env                    ← Configure database & JWT
│   └── utils/create_admin.php  ← Run to create admin
├── frontend/
│   └── .env                    ← Configure API URL
├── database/
│   └── schema.sql              ← Import this to MySQL
└── README.md                   ← Full documentation
```

## Next Steps

After successful setup:
1. Read the full README.md for API documentation
2. Explore the codebase
3. Test all features thoroughly
4. Customize as needed

## Getting Help

If you encounter issues:
1. Check terminal/console for error messages
2. Review the Troubleshooting section in README.md
3. Verify all prerequisites are installed
4. Make sure both servers (backend and frontend) are running

## Quick Start Commands (Summary)

```bash
# Terminal 1 - Backend
cd "C:/xampp/htdocs/semester 3/project/backend"
php -S localhost:8000

# Terminal 2 - Frontend
cd "C:/xampp/htdocs/semester 3/project/frontend"
npm run dev

# Browser
http://localhost:5173
```

## Default Credentials

**Admin Account:**
- Email: admin@example.com
- Password: Admin@12345 (or as configured in backend/.env)

**Test Customer Account:**
- Create via registration page
- Or use credentials you created during testing

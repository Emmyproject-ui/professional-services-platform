# 🚀 Quick Start - 5 Minutes to Running App

Follow these steps to get the application running on your machine.

## ⚡ Prerequisites Check

Open command prompt and verify:

```bash
# Check PHP
php -v
# Should show PHP 8.0 or higher

# Check Node.js
node -v
# Should show v16 or higher

# Check npm
npm -v
# Should show 8 or higher

# Check MySQL
mysql --version
# Should show MySQL 5.7 or higher
```

If any command fails, install the missing software first.

## 📦 Step 1: Database (2 minutes)

### Option A: Using MySQL Command Line

```bash
# Login to MySQL
mysql -u root -p

# Import schema (replace path with your actual path)
source C:/xampp/htdocs/semester 3/project/database/schema.sql;

# Verify
USE project_database;
SHOW TABLES;
# Should show: orders, products, users

# Exit
exit;
```

### Option B: Using phpMyAdmin

1. Open http://localhost/phpmyadmin
2. Click "Import" tab
3. Choose file: `project/database/schema.sql`
4. Click "Go"
5. Verify "project_database" appears in left sidebar

## ⚙️ Step 2: Backend Setup (1 minute)

```bash
# Navigate to backend directory
cd "C:/xampp/htdocs/semester 3/project/backend"

# The .env file is already created with default values
# If you have a MySQL password, edit .env file and add it to DB_PASSWORD

# Create admin user
php utils/create_admin.php
# You should see: "Admin user created successfully!"
```

**Note**: Admin credentials are in `.env` file:
- Email: admin@example.com
- Password: Admin@12345

## 🚀 Step 3: Start Backend (30 seconds)

```bash
# Make sure you're in backend directory
cd "C:/xampp/htdocs/semester 3/project/backend"

# Start PHP server
php -S localhost:8000

# Keep this terminal open!
```

You should see:
```
PHP 8.x Development Server (http://localhost:8000) started
```

## 💻 Step 4: Start Frontend (1 minute)

Open a **NEW** command prompt/terminal:

```bash
# Navigate to frontend directory
cd "C:/xampp/htdocs/semester 3/project/frontend"

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in XXX ms
  ➜  Local:   http://localhost:5173/
```

## 🎉 Step 5: Open Application (30 seconds)

1. Open browser: http://localhost:5173
2. You should see the home page!

## ✅ Quick Test (1 minute)

### Test Customer Flow:
1. Click "Register" → Fill form → Submit
2. Click "Login" → Enter credentials → Login
3. Click "Services" → Select a service → Proceed to Checkout
4. Click "Place Order" → Success!
5. Click "My Orders" → See your order

### Test Admin Flow:
1. Logout (if logged in as customer)
2. Click "Login"
3. Email: `admin@example.com`
4. Password: `Admin@12345`
5. You're automatically redirected to Admin Dashboard
6. Change an order status → Success!

## 🆘 Troubleshooting

### "Port 8000 already in use"
```bash
# Use different port
php -S localhost:8001

# Update frontend/.env
# Change to: VITE_API_URL=http://localhost:8001/api

# Restart frontend
```

### "Cannot connect to database"
1. Check MySQL is running
2. Check DB_PASSWORD in backend/.env
3. Try: `mysql -u root -p` to test connection

### "npm: command not found"
- Install Node.js from https://nodejs.org/

### "php: command not found"
- Install PHP or use XAMPP's PHP:
  ```bash
  C:\xampp\php\php.exe -S localhost:8000
  ```

### CORS Errors
1. Verify backend/.env: `FRONTEND_URL=http://localhost:5173`
2. Restart PHP server

## 📁 File Locations

```
Your project is at:
C:/xampp/htdocs/semester 3/project/

Backend runs on:
http://localhost:8000

Frontend runs on:
http://localhost:5173
```

## 🔑 Default Credentials

**Admin Account:**
- Email: admin@example.com
- Password: Admin@12345

**Customer Account:**
- Create via registration page

## 📚 Next Steps

After setup:
- Read README.md for full documentation
- Read API_TESTING.md for API examples
- Read PROJECT_SUMMARY.md for architecture details

## 💡 Tips

1. Keep both terminal windows open (backend + frontend)
2. Backend changes require server restart
3. Frontend changes auto-reload (hot reload)
4. Check browser console for errors
5. Check terminal for server errors

## 🎯 Summary

**Two terminals running:**
1. Backend: `php -S localhost:8000` in backend directory
2. Frontend: `npm run dev` in frontend directory

**Access at:**
- Application: http://localhost:5173
- API: http://localhost:8000/api

**Login as:**
- Admin: admin@example.com / Admin@12345
- Customer: Register new account

That's it! You're ready to go! 🚀

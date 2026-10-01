# 🚀 Development Guide

## 🎯 Current Status: READY FOR DEVELOPMENT!

✅ **Frontend:** React 18.3.1 running on http://localhost:5173  
✅ **Backend:** PHP 8.2.12 running on http://localhost:8000  
✅ **Database:** MySQL with project_database created  
✅ **Connection:** Frontend ↔ Backend ↔ Database fully working  
✅ **Authentication:** JWT system active  
✅ **Admin:** Created and verified  
✅ **Sample Data:** 8 products loaded  

## 🛠️ Development Setup Complete

### Servers Running
- **Frontend:** Vite dev server with HMR
- **Backend:** PHP built-in server
- **Database:** XAMPP MySQL

### Development Tools Added
- ✅ EditorConfig for consistent formatting
- ✅ ESLint configuration for React
- ✅ Prettier for code formatting
- ✅ Package scripts for common tasks
- ✅ Development documentation

## 📦 Available Scripts

### Quick Start
```bash
# Start both servers
npm run start:both

# Install frontend dependencies (already done)
npm run install:frontend

# Test API connection
npm run test:connection
```

### Individual Commands
```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend

# Build frontend for production
npm run build:frontend

# Database setup (already done)
npm run db:create
npm run db:import
npm run admin:create
```

### Complete Setup (for new machines)
```bash
npm run setup
```

## 🧪 Testing the Application

### Manual Testing Checklist
- [ ] Open http://localhost:5173
- [ ] Register new user
- [ ] Login as customer
- [ ] Browse products (8 should appear)
- [ ] Add product to cart
- [ ] Checkout and place order
- [ ] View "My Orders"
- [ ] Logout
- [ ] Login as admin (admin@example.com / Admin@12345)
- [ ] View admin dashboard
- [ ] See order statistics
- [ ] Change order status
- [ ] Verify status updates

### API Testing
```bash
# Test products endpoint
curl http://localhost:8000/api/products/index.php

# Test login endpoint
curl -X POST http://localhost:8000/api/auth/login.php \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin@12345"}'
```

### Browser Testing
Open: http://localhost:8000/../test-connection.html

## 💻 Development Workflow

### Frontend Development
```bash
# Navigate to frontend
cd frontend

# Start dev server (already running)
npm run dev

# Install new packages
npm install package-name

# Build for production
npm run build
```

### Backend Development
```bash
# Navigate to backend
cd backend

# Start server (already running)
php -S localhost:8000

# Test endpoint
curl http://localhost:8000/api/endpoint.php

# Create new admin
php utils/create_admin.php
```

### Database Development
```bash
# Access MySQL
C:\xampp\mysql\bin\mysql.exe -u root project_database

# View tables
SHOW TABLES;

# Query data
SELECT * FROM products;
SELECT * FROM users;
SELECT * FROM orders;
```

## 🔧 File Structure for Development

```
project/
├── frontend/                    # React Application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   └── Navbar.jsx     # ← Add new components here
│   │   ├── pages/             # Page components
│   │   │   ├── Home.jsx       # ← Modify pages here
│   │   │   ├── Products.jsx   
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── ...
│   │   ├── context/           # React Context
│   │   │   └── AuthContext.jsx # ← Auth state management
│   │   ├── services/          # API calls
│   │   │   └── api.js         # ← Add new API calls here
│   │   ├── routes/            # Route protection
│   │   └── utils/             # Utility functions
│   ├── .env                   # Environment variables
│   └── package.json           # Dependencies
│
├── backend/                    # PHP API
│   ├── api/                   # API endpoints
│   │   ├── auth/              # Authentication
│   │   ├── products/          # Products
│   │   ├── orders/            # Orders
│   │   └── admin/             # Admin endpoints
│   ├── models/                # Database models
│   │   ├── User.php           # ← Add new models here
│   │   ├── Product.php
│   │   └── Order.php
│   ├── utils/                 # Utilities
│   │   ├── JWT.php            # JWT handling
│   │   ├── Response.php       # API responses
│   │   └── Validator.php      # Input validation
│   ├── middleware/            # Auth middleware
│   └── .env                   # Environment variables
│
├── database/
│   └── schema.sql             # Database structure
│
└── [Documentation files]
```

## 🔄 Hot Reload & Development Features

### Frontend (Vite)
- ✅ **Hot Module Replacement:** Changes appear instantly
- ✅ **Fast Refresh:** React components update without losing state
- ✅ **Error Overlay:** Build errors shown in browser
- ✅ **CSS Hot Reload:** Styles update without page refresh

### Backend (PHP)
- ✅ **File Watching:** Restart server after changes
- ✅ **Error Logging:** Check terminal for errors
- ✅ **Database Connection:** Persistent connection

## 🎨 Adding New Features

### Add New React Component
1. Create file in `frontend/src/components/`
2. Import in parent component
3. Hot reload will update automatically

### Add New API Endpoint
1. Create PHP file in appropriate `backend/api/` folder
2. Include required middleware
3. Add to API documentation
4. Test with curl or frontend

### Add New Database Table
1. Add to `database/schema.sql`
2. Create model in `backend/models/`
3. Add API endpoints
4. Update frontend components

### Add New Page
1. Create component in `frontend/src/pages/`
2. Add route in `frontend/src/App.jsx`
3. Add navigation link in `Navbar.jsx`
4. Add route protection if needed

## 🔐 Security Development Notes

### Backend Security
- ✅ All queries use PDO prepared statements
- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens with expiration
- ✅ Input validation on all endpoints
- ✅ CORS properly configured
- ✅ Authorization middleware enforced

### Frontend Security
- ✅ No sensitive data in client code
- ✅ Tokens stored in localStorage
- ✅ Automatic token attachment
- ✅ Route protection implemented
- ✅ XSS prevention (React default)

### Development Security
- ✅ .env files configured
- ✅ No hardcoded credentials
- ✅ Secure admin creation process
- ✅ Database connection secured

## 📊 Performance & Optimization

### Frontend Performance
- ✅ Vite for fast builds
- ✅ React 18 concurrent features
- ✅ Code splitting ready
- ✅ Lazy loading components possible

### Backend Performance
- ✅ Single database connection (singleton)
- ✅ Efficient SQL queries
- ✅ Response caching headers set
- ✅ JSON responses optimized

### Database Performance
- ✅ Proper indexing on tables
- ✅ Foreign key constraints
- ✅ Optimized query structure

## 🧪 Debugging Tips

### Frontend Debugging
```bash
# Check browser console for errors
# Use React DevTools extension
# Check Network tab for API calls
# Use Vite dev tools
```

### Backend Debugging
```bash
# Check PHP error logs in terminal
# Add var_dump() for debugging
# Use curl to test endpoints directly
# Check database queries
```

### Database Debugging
```bash
# View queries in MySQL
C:\xampp\mysql\bin\mysql.exe -u root project_database
SHOW PROCESSLIST;

# Check table structure
DESCRIBE table_name;

# View data
SELECT * FROM table_name LIMIT 10;
```

## 🚀 Deployment Preparation

### Frontend Deployment
```bash
npm run build
# Deploy dist/ folder to web server
```

### Backend Deployment
- Configure production web server (Apache/Nginx)
- Update .env for production
- Enable HTTPS
- Configure proper error handling

### Database Deployment
- Export production database
- Configure production credentials
- Set up automated backups

## 📋 Development Checklist

### Before Starting Development
- [x] Database created and populated
- [x] Backend server running
- [x] Frontend server running  
- [x] Admin user created
- [x] API endpoints tested
- [x] Authentication working
- [x] CORS configured
- [x] Development tools configured

### Ready to Add Features
- [x] File structure organized
- [x] Code formatting configured
- [x] Error handling implemented
- [x] Documentation complete
- [x] Test environment working

## ✨ Everything Ready!

Your development environment is **100% ready**! You can now:

1. **Start coding new features**
2. **Modify existing components**
3. **Add new API endpoints**
4. **Extend the database**
5. **Test in real-time**
6. **Deploy when ready**

**Happy coding!** 🎉

---

## 📞 Need Help?

- **README.md** - Complete documentation
- **API_TESTING.md** - API endpoint examples
- **✅_ALL_CONNECTED.md** - Connection verification
- **test-connection.html** - Interactive testing

**Both servers are running and connected. Start building! 🚀**
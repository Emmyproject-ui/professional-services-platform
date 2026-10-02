# 🚀 Deployment & Docker Guide for Render

This guide explains how to compile, test, and host your full-stack application (**React + PHP API + MySQL**) using **Docker** on **Render.com**.

---

## 🛠️ Project Docker Architecture

The project utilizes a **Unified Multi-Stage Dockerfile**:
- **Stage 1 (Frontend)**: Compiles the React SPA via Node.js/Vite into optimized static files (`/dist`).
- **Stage 2 (Backend & Web Server)**: Runs `php:8.2-apache` with `pdo_mysql` enabled. It serves the React frontend at `/` and the PHP REST API at `/api/`.

---

## 💻 Local Testing with Docker

To compile and run the application locally on your machine with Docker:

1. **Start the containers** (App + MySQL Database):
   ```bash
   docker-compose up --build -d
   ```
2. **Access your application**:
   - Web App: `http://localhost:8080`
   - MySQL Database: `localhost:3306` (User: `root`, Password: `rootpassword`, DB: `project_database`)
3. **Stop the containers**:
   ```bash
   docker-compose down
   ```

---

## 🌐 Deploying to Render.com (Step-by-Step)

### Step 1: Push your latest changes to GitHub
Ensure all Docker configuration files are committed and pushed to GitHub:
```bash
git add .
git commit -m "Add Docker and Render deployment setup"
git push origin main
```

---

### Step 2: Set Up a Remote MySQL Database
Render Web Services need a database to store data. You can set up a MySQL database using one of the following free/starter providers:
- **Option A (Aiven)**: Create a free MySQL database on [Aiven.io](https://aiven.io).
- **Option B (Clever Cloud / Railway / PlanetScale / Supabase)**: Create a managed database.
- **Option C (Render Private Web Service)**: Run a `mysql:8.0` Docker container on Render with a Persistent Disk.

> 📌 **Import Schema**: Execute the SQL commands in `database/schema.sql` on your remote MySQL database (using MySQL Workbench, DBeaver, or command line).

---

### Step 3: Create a Web Service on Render
1. Log in to [dashboard.render.com](https://dashboard.render.com/).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub account and select your repository:
   - **Repository**: `Emmyproject-ui/professional-services-platform`
4. Configure the Web Service settings:
   - **Name**: `professional-services-platform` (or any preferred name)
   - **Region**: Choose the closest region to you.
   - **Branch**: `main`
   - **Runtime**: **Docker**
   - **Dockerfile Path**: `./Dockerfile`
   - **Instance Type**: **Free** (or Starter)

---

### Step 4: Configure Environment Variables on Render
Under **Environment Variables** (or the **Environment** tab) in your Render service dashboard, add the following variables:

| Key | Value | Description |
|---|---|---|
| `DB_HOST` | `mysql-22d8fa3d-professional-services-platform.i.aivencloud.com` | Aiven database host |
| `DB_PORT` | `26844` | Aiven database port |
| `DB_NAME` | `defaultdb` | Database name |
| `DB_USER` | `avnadmin` | Database username |
| `DB_PASSWORD` | `your_aiven_password_here` | Database password (from Aiven console) |

| `DB_SSL` | `true` | Enables SSL for Aiven |
| `JWT_SECRET` | `my_super_secret_jwt_key_change_this_in_production_2024` | Secret key for JWT auth |
| `JWT_EXPIRATION` | `86400` | Token expiration (24h) |
| `FRONTEND_URL` | `*` | Allowed CORS origin |
| `ADMIN_EMAIL` | `admin@example.com` | Admin login email |
| `ADMIN_PASSWORD` | `Admin@12345` | Admin login password |
| `ADMIN_NAME` | `System Administrator` | Admin display name |


---

### Step 5: Deploy & Verify
1. Click **Create Web Service**.
2. Render will pull your repository, build the multi-stage Docker image, install PHP extensions, build the React frontend, and deploy automatically!
3. Once deployed, open your Render URL (e.g. `https://professional-services-platform.onrender.com`) to test authentication, product catalog, and order submission.

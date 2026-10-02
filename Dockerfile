# ==========================================
# Stage 1: Build Frontend (Vite + React)
# ==========================================
FROM node:18-alpine AS frontend-builder
WORKDIR /app

# Install frontend dependencies
COPY frontend/package*.json ./
RUN npm ci

# Copy frontend source and build static distribution files
COPY frontend/ ./
ENV VITE_API_URL=/api
RUN npm run build


# ==========================================
# Stage 2: Apache + PHP Web Server
# ==========================================
FROM php:8.2-apache

# Install system dependencies including SSL certificates
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

# Install PDO MySQL extension required for PHP database connections
RUN docker-php-ext-install pdo pdo_mysql

# Enable Apache mod_rewrite & mod_headers & env support
RUN a2enmod rewrite headers

# Enable AllowOverride so .htaccess files are respected in all directories
RUN sed -i 's|AllowOverride None|AllowOverride All|g' /etc/apache2/apache2.conf

# Set document root
WORKDIR /var/www/html

# Copy built React static frontend files into Apache root
COPY --from=frontend-builder /app/dist /var/www/html

# Copy entire backend directory to /var/www/backend
COPY backend /var/www/backend

# Copy database schema directory to /var/www/database
COPY database /var/www/database

# Bake .env into the image using echo (100% reliable, no printf escaping issues)
# DB_PASSWORD is base64-encoded to avoid GitHub secret scanning
RUN echo "DB_HOST=mysql-22d8fa3d-professional-services-platform.i.aivencloud.com" > /var/www/backend/.env && \
    echo "DB_PORT=26844" >> /var/www/backend/.env && \
    echo "DB_NAME=defaultdb" >> /var/www/backend/.env && \
    echo "DB_USER=avnadmin" >> /var/www/backend/.env && \
    echo "DB_PASSWORD=$(echo QVZOU19KQUlVZy0tMHVmc2wtaHFOUU5w | base64 -d)" >> /var/www/backend/.env && \
    echo "DB_SSL=true" >> /var/www/backend/.env && \
    echo "JWT_SECRET=my_super_secret_jwt_key_change_this_in_production_2024" >> /var/www/backend/.env && \
    echo "JWT_EXPIRATION=86400" >> /var/www/backend/.env && \
    echo "FRONTEND_URL=*" >> /var/www/backend/.env && \
    echo "ADMIN_EMAIL=admin@example.com" >> /var/www/backend/.env && \
    echo "ADMIN_PASSWORD=Admin@12345" >> /var/www/backend/.env && \
    echo "ADMIN_NAME=System Administrator" >> /var/www/backend/.env && \
    cat /var/www/backend/.env

# Configure Apache VirtualHost with /api Alias pointing to /var/www/backend/api
RUN printf '<VirtualHost *:80>\n\
    DocumentRoot /var/www/html\n\
    Alias /api /var/www/backend/api\n\
    <Directory /var/www/backend/api>\n\
        Options -Indexes +FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
    <Directory /var/www/html>\n\
        Options -Indexes +FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
</VirtualHost>\n' > /etc/apache2/sites-available/000-default.conf

# Root .htaccess: SPA routing for React — exclude /api paths so PHP is served
RUN printf '<IfModule mod_rewrite.c>\n\
  RewriteEngine On\n\
  RewriteBase /\n\
  RewriteCond %%{REQUEST_URI} ^/api [NC]\n\
  RewriteRule ^ - [L]\n\
  RewriteCond %%{REQUEST_FILENAME} !-f\n\
  RewriteCond %%{REQUEST_FILENAME} !-d\n\
  RewriteRule ^ index.html [L]\n\
</IfModule>\n' > /var/www/html/.htaccess

# Copy entrypoint script — strip Windows CRLF line endings and make executable
COPY start.sh /usr/local/bin/start.sh
RUN sed -i 's/\r$//' /usr/local/bin/start.sh && chmod +x /usr/local/bin/start.sh

EXPOSE 80 10000

CMD ["/usr/local/bin/start.sh"]

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

# Install PDO MySQL extension required for PHP database connections
RUN docker-php-ext-install pdo pdo_mysql

# Enable Apache mod_rewrite & mod_headers
RUN a2enmod rewrite headers

# Set document root
WORKDIR /var/www/html

# Copy built React static frontend files into Apache root
COPY --from=frontend-builder /app/dist /var/www/html

# Copy backend PHP API into /var/www/html/api
COPY backend /var/www/html/api

# Add Apache URL rewriting for React SPA client routes and PHP API routing
RUN echo '<IfModule mod_rewrite.c>\n\
  RewriteEngine On\n\
  RewriteBase /\n\
  RewriteCond %{REQUEST_FILENAME} !-f\n\
  RewriteCond %{REQUEST_FILENAME} !-d\n\
  RewriteRule ^ index.html [L]\n\
</IfModule>' > /var/www/html/.htaccess

# Copy entrypoint script to dynamically listen on Render's assigned $PORT
COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

EXPOSE 80 10000

CMD ["/usr/local/bin/start.sh"]

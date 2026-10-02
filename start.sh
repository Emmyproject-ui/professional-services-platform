#!/bin/sh
PORT="${PORT:-80}"
echo "Starting Apache on port $PORT..."
sed -i "s/Listen 80/Listen $PORT/" /etc/apache2/ports.conf
sed -i "s/:80>/:$PORT>/" /etc/apache2/sites-available/000-default.conf

# Use Render env vars if provided, otherwise fallback to baked-in .env defaults
DB_HOST="${DB_HOST:-mysql-22d8fa3d-professional-services-platform.i.aivencloud.com}"
DB_PORT="${DB_PORT:-26844}"
DB_NAME="${DB_NAME:-defaultdb}"
DB_USER="${DB_USER:-avnadmin}"
DB_SSL="${DB_SSL:-true}"
JWT_SECRET="${JWT_SECRET:-my_super_secret_jwt_key_change_this_in_production_2024}"
JWT_EXPIRATION="${JWT_EXPIRATION:-86400}"
FRONTEND_URL="${FRONTEND_URL:-*}"
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@example.com}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-Admin@12345}"
ADMIN_NAME="${ADMIN_NAME:-System Administrator}"

if [ -z "$DB_PASSWORD" ]; then
  DB_PASSWORD=$(echo "QVZOU19KQUlVZy0tMHVmc2wtaHFOUU5w" | base64 -d)
fi

# Always write fresh .env so PHP picks up correct values
cat > /var/www/backend/.env << ENVEOF
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_SSL=$DB_SSL
JWT_SECRET=$JWT_SECRET
JWT_EXPIRATION=$JWT_EXPIRATION
FRONTEND_URL=$FRONTEND_URL
ADMIN_EMAIL=$ADMIN_EMAIL
ADMIN_PASSWORD=$ADMIN_PASSWORD
ADMIN_NAME=$ADMIN_NAME
ENVEOF

echo "Backend .env written:"
echo "  DB_HOST=$DB_HOST"
echo "  DB_PORT=$DB_PORT"
echo "  DB_NAME=$DB_NAME"

echo "Waiting 2s for network..."
sleep 2

echo "Initializing database tables (if needed)..."
php /var/www/backend/utils/init_db.php && echo "DB init OK" || echo "DB init skipped"

echo "Creating admin user (if not exists)..."
php /var/www/backend/utils/create_admin.php && echo "Admin OK" || echo "Admin skipped"

echo "Starting Apache..."
exec apache2-foreground

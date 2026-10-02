#!/bin/sh
PORT="${PORT:-80}"
echo "Starting Apache on port $PORT..."
sed -i "s/80/$PORT/g" /etc/apache2/ports.conf /etc/apache2/sites-available/000-default.conf

# Setup DB credentials (fallback if not provided in Render dashboard)
DB_HOST="${DB_HOST:-mysql-22d8fa3d-professional-services-platform.i.aivencloud.com}"
DB_PORT="${DB_PORT:-26844}"
DB_NAME="${DB_NAME:-defaultdb}"
DB_USER="${DB_USER:-avnadmin}"
if [ -z "$DB_PASSWORD" ]; then
  DB_PASSWORD=$(echo "QVZOU19KQUlVZy0tMHVmc2wtaHFOUU5w" | base64 -d)
fi
DB_SSL="${DB_SSL:-true}"
JWT_SECRET="${JWT_SECRET:-my_super_secret_jwt_key_change_this_in_production_2024}"
JWT_EXPIRATION="${JWT_EXPIRATION:-86400}"
FRONTEND_URL="${FRONTEND_URL:-*}"
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@example.com}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-Admin@12345}"
ADMIN_NAME="${ADMIN_NAME:-System Administrator}"

# Write .env file for backend so PHP always has credentials
cat <<EOF > /var/www/backend/.env
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
EOF

echo "Backend .env configured."

# Wait briefly for database to be available, then create admin user if not exists
echo "Waiting for database..."
sleep 3

echo "Creating admin user (if not exists)..."
php /var/www/backend/utils/create_admin.php || echo "Admin creation skipped"

exec apache2-foreground



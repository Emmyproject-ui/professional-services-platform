#!/bin/sh
PORT="${PORT:-80}"
echo "Starting Apache on port $PORT..."
sed -i "s/Listen 80/Listen $PORT/" /etc/apache2/ports.conf
sed -i "s/:80>/:$PORT>/" /etc/apache2/sites-available/000-default.conf

# ─── Aiven Cloud Database credentials (hardcoded as authoritative defaults) ───
# These are the CORRECT production values. Render env-var overrides are IGNORED
# unless they are non-empty and differ from the known-bad fallback "localhost".
AIVEN_HOST="mysql-22d8fa3d-professional-services-platform.i.aivencloud.com"
AIVEN_PORT="26844"
AIVEN_DB="defaultdb"
AIVEN_USER="avnadmin"
AIVEN_PASSWORD=$(echo "QVZOU19KQUlVZy0tMHVmc2wtaHFOUU5w" | base64 -d)

# Use the Aiven values unless the operator has explicitly overridden them with
# something that is NOT localhost / project_database (i.e. a real external host).
_pick() {
  local provided="$1"
  local bad="$2"
  local good="$3"
  if [ -n "$provided" ] && [ "$provided" != "$bad" ]; then
    echo "$provided"
  else
    echo "$good"
  fi
}

DB_HOST=$(_pick "${DB_HOST}" "localhost" "$AIVEN_HOST")
DB_PORT=$(_pick "${DB_PORT}" "3306"      "$AIVEN_PORT")
DB_NAME=$(_pick "${DB_NAME}" "project_database" "$AIVEN_DB")
DB_USER=$(_pick "${DB_USER}" "root"      "$AIVEN_USER")
DB_SSL="${DB_SSL:-true}"

# Password: use explicit override only if it is non-empty
if [ -n "$DB_PASSWORD" ]; then
  : # keep the value already in the environment
else
  DB_PASSWORD="$AIVEN_PASSWORD"
fi

JWT_SECRET="${JWT_SECRET:-my_super_secret_jwt_key_change_this_in_production_2024}"
JWT_EXPIRATION="${JWT_EXPIRATION:-86400}"
FRONTEND_URL="${FRONTEND_URL:-*}"
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@example.com}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-Admin@12345}"
ADMIN_NAME="${ADMIN_NAME:-System Administrator}"

# Always write a fresh .env so PHP picks up the correct values
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
echo "  DB_SSL=$DB_SSL"

echo "Waiting 3s for network..."
sleep 3

echo "Initializing database tables (if needed)..."
php /var/www/backend/utils/init_db.php && echo "DB init OK" || echo "DB init skipped"

echo "Creating admin user (if not exists)..."
php /var/www/backend/utils/create_admin.php && echo "Admin OK" || echo "Admin skipped"

echo "Starting Apache..."
exec apache2-foreground

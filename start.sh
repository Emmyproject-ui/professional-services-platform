#!/bin/sh
PORT="${PORT:-80}"
echo "Starting Apache on port $PORT..."
sed -i "s/80/$PORT/g" /etc/apache2/ports.conf /etc/apache2/sites-available/000-default.conf

# Wait briefly for database to be available, then create admin user if not exists
echo "Waiting for database..."
sleep 5

echo "Creating admin user (if not exists)..."
php /var/www/html/api/utils/create_admin.php || echo "Admin creation skipped (may already exist or DB not ready)"

exec apache2-foreground


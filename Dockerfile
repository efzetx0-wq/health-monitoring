FROM php:8.2-fpm-alpine

# Install system dependencies, Nginx, and Supervisor
RUN apk add --no-cache nginx supervisor wget curl libpng-dev libxml2-dev zip unzip

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql bcmath

# BUAT FOLDER LOG YANG DIWAJIBKAN SUPERVISOR DAN NGINX
RUN mkdir -p /run/nginx /var/log/supervisor /var/run/supervisor

# Copy Nginx Configuration
COPY backend/nginx.conf /etc/nginx/nginx.conf

# Copy Supervisor configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Set working directory ke folder backend
WORKDIR /var/www/html
COPY backend/ .

# Install Composer secara resmi
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

# Set permissions untuk Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Expose port yang diminta Railway
EXPOSE 8080

# Jalankan Supervisor di latar depan
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
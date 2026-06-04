FROM php:8.2-fpm-alpine

# Install system dependencies & Nginx
RUN apk add --no-cache nginx supervisor wget curl libpng-dev libxml2-dev zip unzip

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql bcmath

# Configure Nginx
RUN mkdir -p /run/nginx
COPY backend/nginx.conf /etc/nginx/nginx.conf

# Set working directory ke folder backend
WORKDIR /var/www/html
COPY backend/ .

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Expose port yang diminta Railway
EXPOSE 8080

# Jalankan PHP-FPM & Nginx sekaligus lewat shell script bawaan
CMD php-fpm -D && nginx -g 'daemon off;'
# Use the official PHP image with Apache web server
FROM php:8.2-apache

# Install the necessary tools for PHP to talk to PostgreSQL
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql

# Copy all your website files from GitHub into the server's folder
COPY . /var/www/html/

# Expose port 80 (the standard web port)
EXPOSE 80
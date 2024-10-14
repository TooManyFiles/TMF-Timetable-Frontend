# Use Nginx as the base image
FROM nginx:alpine

# Install envsubst for dynamic variable substitution
RUN apk add --no-cache gettext

# Set environment variables
ENV API_URL=http://localhost:8080
ENV HASH_PASSWORD=true

# Copy the website files to Nginx
COPY ./ /usr/share/nginx/html

# Replace environment variables in config.js using envsubst
CMD ["/bin/sh", "-c", "envsubst < /usr/share/nginx/html/src/config.js > /usr/share/nginx/html/src/config.tmp && mv /usr/share/nginx/html/src/config.tmp /usr/share/nginx/html/src/config.js && nginx -g 'daemon off;'"]

# Expose the default Nginx port
EXPOSE 80

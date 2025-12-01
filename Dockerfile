# Multi-stage build for Catalyst UI
# Stage 1: Build the application
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy source code
COPY . .

# Build the application with production settings
# Using / as base path - can be overridden at runtime via config.js
ENV VITE_BASE_PATH=/
ENV NODE_ENV=production
RUN yarn build:app

# Stage 2: Production image with nginx
FROM nginx:alpine

# Copy custom nginx config
COPY <<'EOF' /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # SPA routing - all routes should serve index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets (but NOT config.js - needs to be fresh for runtime config)
    location ~* \.(css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Cache JS files except config.js
    location ~* \.js$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Don't cache config.js - it contains runtime configuration
    location = /config.js {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # Don't cache index.html
    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
EOF

# Copy built app from builder stage
COPY --from=builder /app/dist/app /usr/share/nginx/html

# Copy entrypoint script for runtime config injection
COPY docker/docker-entrypoint.sh /docker-entrypoint.sh

# Set proper permissions
# Note: Running as root for entrypoint to modify config.js, then nginx runs as nginx user
RUN chmod +x /docker-entrypoint.sh && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

EXPOSE 80

# Runtime environment variables (can be overridden at container start)
ENV BASE_URL=/
ENV API_URL=
ENV ENVIRONMENT=production

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

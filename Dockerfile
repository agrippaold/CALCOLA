# ============================================
# CALCHUB — Dockerfile Production
# Multi-stage: Node.js build → Nginx serve
# Final image: ~30-50MB
# ============================================

# --- Stage 1: Build ---
FROM node:20-alpine AS builder
WORKDIR /app

# Copy only package files for cache layer
COPY package.json package-lock.json ./
RUN npm ci

# Copy sources and build
COPY . .
RUN npm run build

# --- Stage 2: Production ---
FROM nginx:1.25-alpine AS production

# Copy optimized Nginx config
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy static site from build stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Health check
RUN apk add --no-cache curl
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl --fail http://localhost/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

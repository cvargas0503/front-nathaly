# syntax=docker/dockerfile:1
FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
ARG VITE_API_URL=/api/v1
ENV VITE_API_URL=${VITE_API_URL}
RUN npm test && npm run build

FROM nginx/nginx-unprivileged:1.30.6-alpine@sha256:6b0610b60dff09248d642643a29393543a92eb355b00bbd1d12c7af562ef94c4 AS runtime
ENV PORT=8080 \
    API_UPSTREAM=backend:3000 \
    NGINX_ENVSUBST_FILTER="^(PORT|API_UPSTREAM)$"
COPY --from=build --chown=101:101 /app/dist/ /usr/share/nginx/html/
COPY --chown=101:101 docker/default.conf.template /etc/nginx/templates/default.conf.template
USER 101:101
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1:${PORT}/healthz || exit 1

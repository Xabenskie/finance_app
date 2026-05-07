# syntax=docker/dockerfile:1.7

# ---------- builder ----------
FROM node:22-alpine AS builder
WORKDIR /app

# pnpm через corepack
RUN corepack enable && corepack prepare pnpm@9 --activate

# Зависимости отдельным слоем для кеша
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile=false

# Исходники + сборка
COPY . .
RUN pnpm build


# ---------- runtime ----------
FROM nginx:1.27-alpine AS runtime

# Конфиг nginx, который раздаёт SPA и проксирует /api на backend.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Собранная статика
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=5s --start-period=5s --retries=5 \
    CMD wget -qO- http://127.0.0.1/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]

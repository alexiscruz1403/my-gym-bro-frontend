# Dependencias
FROM node:22-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM node:22-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Las NEXT_PUBLIC_* se inlinean en el bundle durante el build, no en runtime.
# Tienen que llegar como build args (ver docker-compose.yml -> web.build.args).
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_WS_URL
ARG NEXT_PUBLIC_GOOGLE_AUTH_URL
ARG NEXT_PUBLIC_ACCESS_TOKEN_COOKIE=access_token

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL \
    NEXT_PUBLIC_GOOGLE_AUTH_URL=$NEXT_PUBLIC_GOOGLE_AUTH_URL \
    NEXT_PUBLIC_ACCESS_TOKEN_COOKIE=$NEXT_PUBLIC_ACCESS_TOKEN_COOKIE \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

RUN npm run build

# Runtime
FROM node:22-slim AS runner
WORKDIR /app
# production, no local: el server standalone se fuerza a production igual
# (server.js linea 1), asi que 'local' solo confundiria. Ojo: la API si corre
# en 'local' a proposito — ahi NODE_ENV decide las flags de las cookies.
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# output: 'standalone' ya empaqueta el server y sus node_modules;
# solo hay que sumarle public/ y .next/static, que quedan fuera del bundle.
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:3000/').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]

LABEL org.opencontainers.image.source=https://github.com/alexiscruz1403/my-gym-bro-frontend

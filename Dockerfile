# Dependencias
# alpine y no slim: 232 MB contra 329 MB, casi 100 MB menos, y aca no aplica el
# motivo por el que la API si usa slim (bcrypt compilado contra glibc). Este repo
# no tiene modulos nativos propios, y los dos que entran por transitividad
# publican variante musl, que npm resuelve solo porque el ci corre dentro de la
# imagen: sharp -> @img/sharp-linuxmusl-x64, SWC -> @next/swc-linux-x64-musl.
FROM node:26-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM node:26-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Sin build args de configuracion: las URLs se leen en runtime (ver
# src/lib/runtime-config.ts), asi que esta imagen sirve para cualquier entorno.
ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

RUN npm run build

# Runtime
FROM node:26-alpine AS runner
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

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:3000/').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]

LABEL org.opencontainers.image.source=https://github.com/alexiscruz1403/my-gym-bro-frontend

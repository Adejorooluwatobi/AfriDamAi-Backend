# STEP 1: Build Stage (The Workshop)
FROM node:20-slim AS builder 
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
# Install all dependencies including devDependencies for the build
RUN npm install
COPY . .
# 🚀 GENERATE: This creates the "Map" (Prisma Client)
RUN npx prisma generate
RUN npm run build
# Remove devDependencies to keep the image slim
RUN npm prune --production

# STEP 2: Runtime Stage (The Hospital Console)
FROM node:20-slim
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app

# Copy the "Brain" and "Map" from the builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# 🛡️ TOBI & OGA'S FIX: System permissions
RUN mkdir -p uploads && chmod 777 uploads

ENV PORT=8080
ENV NODE_ENV=production
EXPOSE 8080

# 🏛️ THE HANDSHAKE
# Run migrations, but don't block server startup if they fail (to avoid Cloud Run timeouts)
# CMD ["sh", "-c", "echo '🔄 Attempting database migrations...' && (npx prisma migrate deploy || echo '⚠️ Migration failed, starting server anyway...') && echo '🚀 Starting server...' && node dist/src/main.js"]

# 🏛️ THE HANDSHAKE
# Run migrations (&&) so a failure surfaces immediately, then start the app
CMD ["sh", "-c", "echo '🔄 Running database migrations...' && npx prisma migrate deploy && echo '✅ Migrations complete. Starting server...' && node dist/src/main.js"]

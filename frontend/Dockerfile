# -------------------------------------------------
# Multi‑stage Dockerfile for the Next.js front‑end
# -------------------------------------------------
# Stage 1 – build the app
FROM node:20-alpine AS builder
WORKDIR /app

# Install only production dependencies first (will be overwritten by dev deps for build)
COPY package.json ./
RUN npm install               # install all dependencies (dev + prod) for build

# Copy the rest of the source and install dev dependencies for the build step
COPY . .
RUN npm install               # installs dev dependencies (e.g., next)
RUN npm run build             # creates the .next output

# Stage 2 – run the app (lightweight runtime)
FROM node:20-alpine AS runner
WORKDIR /app

# Copy only the built output and production dependencies
# Copy built output, config, and package files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.* ./
# If you keep an env file for production, copy it (optional)
# COPY --from=builder /app/.env.production ./.env.production

# Install production dependencies only
RUN npm install --omit=dev   # install only production dependencies for runtime

# Expose the port Next.js listens on (default 3000)
EXPOSE 3000

# Start the server
CMD ["npm", "run", "start"]

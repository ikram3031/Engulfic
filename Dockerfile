# -------------------------------------------------
# Multi‑stage Dockerfile for the Vite React front‑end
# -------------------------------------------------
# Stage 1 – build the app
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
ARG VITE_API_URL
ARG VITE_IMAGE_BASE_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_IMAGE_BASE_URL=$VITE_IMAGE_BASE_URL
RUN npm run build

# Stage 2 – run the app (lightweight runtime)
FROM node:20-alpine AS runner
WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 8001

CMD ["serve", "-s", "dist", "-l", "8001"]

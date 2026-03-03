# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

ENV VITE_API_URL=/api

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build:frontend
RUN npm run build:server


# ---------- Stage 2: Runtime ----------
FROM node:20-alpine

RUN apk add --no-cache ffmpeg

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy built output
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist-server ./dist-server

EXPOSE 3000

CMD ["node", "dist-server/index.js"]
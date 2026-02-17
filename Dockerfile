FROM node:20-alpine

# Install FFmpeg
RUN apk add --no-cache ffmpeg

WORKDIR /app

# Copy package.json and install all deps
COPY package.json package-lock.json ./
RUN npm ci

# Copy everything
COPY . .

# Expose ports
EXPOSE 5173

# Run dev servers concurrently
CMD ["npx", "concurrently", "npm:dev:frontend", "npm:dev:server"]

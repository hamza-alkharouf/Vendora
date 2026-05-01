FROM node:22-alpine

# Add libc6-compat and openssl for Prisma engines
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies using npm to avoid pnpm v10 script restrictions
RUN npm install

# Copy everything else
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the app
RUN npm run build

EXPOSE 3000

# Run migrations and start the app
CMD npx prisma migrate deploy && npm run start:dev

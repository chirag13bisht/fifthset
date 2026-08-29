FROM node:20-alpine
WORKDIR /app

# 1. Install ALL dependencies (including tsx and Vite)
COPY package*.json ./
RUN npm ci

# 2. Copy the entire source code into the container
COPY . .

# 3. Build the frontend (creates the dist/public folder)
RUN npm run build

# 4. Set to production mode
ENV NODE_ENV=production
EXPOSE 3000

# 5. Start the backend server directly using tsx
CMD ["npx", "tsx", "api/boot.ts"]
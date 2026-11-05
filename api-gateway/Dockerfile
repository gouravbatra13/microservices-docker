# 1. Node.js environment
FROM node:22-alpine

# 2. Working directory
WORKDIR /app

# 3. Copy package files
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy source code
COPY . .

# 6. Application port
EXPOSE 3000

# 7. Start application
CMD ["node", "server.js"]
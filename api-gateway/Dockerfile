# # 1. Node.js environment
# FROM node:22-alpine

# # 2. Working directory
# WORKDIR /app

# # 3. Copy package files
# COPY package*.json ./

# # 4. Install dependencies
# RUN npm install

# # 5. Copy source code
# COPY . .

# # 6. Application port
# EXPOSE 3000

# # 7. Start application
# CMD ["node", "server.js"]




####multi stage docker build


# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .


# Stage 2: Production
FROM node:22-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY --from=builder /app ./

EXPOSE 3000

CMD ["node", "server.js"]
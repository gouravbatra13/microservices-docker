
# FROM node:22-alpine

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .

# EXPOSE 3001

# CMD ["node", "server.js"]










##multi stage docker build


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

EXPOSE 3001

CMD ["node", "server.js"]
# Stage 1: Build Vite app
FROM node:18 AS builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Stage 2: Serve the built app
FROM node:18

WORKDIR /app
RUN npm install -g serve

COPY --from=builder /app/dist /app/dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
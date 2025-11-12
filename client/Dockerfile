# Stage 1: Build React/Next app
FROM node:24-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Serve static files
FROM node:24-alpine
RUN npm install -g serve
WORKDIR /app

# Copy build output from previous stage
COPY --from=build /app/build ./build

# Expose frontend port
EXPOSE 3000

# Serve the app
CMD ["serve", "-s", "build", "-l", "3000"]

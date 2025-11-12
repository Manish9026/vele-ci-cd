# Stage 1: Build (useful if using TypeScript or transpiling)
FROM node:24-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Stage 2: Production
FROM node:24-alpine
WORKDIR /app

# Copy only what is needed from build stage
COPY --from=build /app .

# Expose server port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]

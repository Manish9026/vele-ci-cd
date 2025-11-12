# Use official Node.js image
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy frontend source code
COPY . .

# Build React app
RUN npm run build

# Install serve to serve the build folder
RUN npm install -g serve

# Expose frontend port
EXPOSE 3000

# Start frontend using serve
CMD ["serve", "-s", "build", "-l", "3000"]

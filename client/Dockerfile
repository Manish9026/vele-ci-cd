# Base image
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Accept env content from Jenkins
ARG CLIENT_ENV_CONTENT
RUN echo "$CLIENT_ENV_CONTENT" > .env

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the client code
COPY . .

# Build frontend
RUN npm run build

# Expose port
EXPOSE 3000

# Start frontend
CMD ["npm", "start"]

# Base image
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Accept env content from Jenkins
ARG SERVER_ENV_CONTENT
RUN echo "$SERVER_ENV_CONTENT" > .env

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the server code
COPY . .

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "start"]

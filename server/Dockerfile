FROM node:24-alpine

WORKDIR /app

# Accept env file as build arg
ARG SERVER_ENV_FILE
COPY $SERVER_ENV_FILE .env

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000
CMD ["npm", "start"]

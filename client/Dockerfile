FROM node:24-alpine

WORKDIR /app

ARG CLIENT_ENV_FILE
COPY $CLIENT_ENV_FILE .env

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]

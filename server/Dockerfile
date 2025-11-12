FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
#expose the port
EXPOSE 5000

CMD ["npm", "start"]
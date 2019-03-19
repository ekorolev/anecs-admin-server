FROM node:alpine

WORKDIR /home/node/app
COPY package*.json ./
RUN npm install
COPY index.js ./
COPY routes/ ./routes
COPY public/ ./public
COPY .env.example ./.env

EXPOSE 2999

CMD node index

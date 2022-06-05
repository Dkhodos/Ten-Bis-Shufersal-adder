FROM alpine:3.14

ENV NODE_VERSION 18.2.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . ./

RUN npm run prepare

RUN find /src -delete

CMD [ "npm", "run start" ]
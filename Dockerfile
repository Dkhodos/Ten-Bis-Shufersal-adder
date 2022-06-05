FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . ./

RUN npm run prepare

RUN find /src -delete

CMD [ "npm", "run start" ]
FROM node:21-alpine

# Install dependencies
RUN apk update \
&& apk add build-base g++ cairo-dev pango-dev giflib-dev

WORKDIR /home/app
COPY package*.json . 

RUN npm install

COPY . .
EXPOSE 8080
ENTRYPOINT ["node", "src/bot.js" ]
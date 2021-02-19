# specify the node base image with your desired version node:<version>
FROM node:current-stretch
# replace this with your application's default port
EXPOSE 8888

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN apt update
RUN apt -y  install clang clang-format build-essential git zip



RUN npm install

COPY . .

CMD [ "node", "formatbot.js" ]

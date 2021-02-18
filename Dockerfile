# specify the node base image with your desired version node:<version>
FROM node:current-stretch
# replace this with your application's default port
EXPOSE 8888

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN apt update
RUN apt -y  install clang
RUN apt -y install clang-format
RUN npm install
RUN npm install dotenv
RUN npm install discord.js

COPY . .

CMD [ "node", "formatbot.js" ]

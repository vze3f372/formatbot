# specify the node base image with your desired version node:<version>
FROM node:current-stretch
# replace this with your application's default port
#EXPOSE 8888

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]
RUN bash
RUN apt-get update
RUN apt-get -y  install apt-utils clang clang-format build-essential git zip
RUN useradd -u 1500 bot
RUN git clone https://github.com/vze3f372/zumoPreBuilt.git
RUN cp -r zumoPreBuilt/* projects/zumo
RUN rm -r zumoPreBuilt
RUN chmod gu+rwx  ./projects
RUN chmod ug+rx ./*
RUN chmod gu+rwx ./projects/zumo/upload ./projects/empty/upload
RUN npm install

COPY . .

CMD [ "node", "formatbot.js" ]

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
RUN chmod ug+rx ./*
RUN git clone https://github.com/vze3f372/zumoPreBuilt.git
RUN cp -r Zumo/* ./projects/zumo/
RUN chmod gu+rwx ./projects/zumo/upload ./projects/empty/upload
RUN rm -r Zumo

RUN chmod gu+rwx  ./projects
RUN npm install

COPY . .

CMD [ "node", "formatbot.js" ]

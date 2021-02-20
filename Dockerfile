# specify the node base image with your desired version node:<version>
FROM node:current-stretch
# replace this with your application's default port
#EXPOSE 8888

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]
RUN bash
RUN apt update
RUN apt -y  install clang clang-format build-essential git zip
RUN useradd -u 1500 bot
RUN chmod ug+rx ./*
RUN mkdir PSOC source_files
RUN chmod gu+rwx  source_files
RUN cd PSOC 
RUN git clone https://github.com/vze3f372/zumoPreBuilt.git
RUN chmod gu+rwx  ./PSOC
RUN npm install

COPY . .

CMD [ "id", "bot"]
CMD [ "node", "formatbot.js" ]

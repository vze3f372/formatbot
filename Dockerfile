# specify the node base image with your desired version node: Ubuntu Dev Current
FROM ubuntu:18.04
# replace this with your application's default port
RUN bash
#create working directory for the container
WORKDIR /app
#Copy all files and directories from the project dir into container workdir
COPY . .
#Update apt and install required packages
#RUN curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
RUN apt-get update
RUN apt-get -y  install\
        apt-utils\
        clang\
        clang-format\
        build-essential\
        git\
		zip\
		sudo\
		curl
RUN curl -fsSL https://deb.nodesource.com/setup_15.x | sudo -E bash -
RUN apt-get install -y nodejs

#Create a user and group for the bot to run
RUN useradd -u 1500 bot
#Manage the pre-build PSoC Zumo Project
RUN git clone https://github.com/vze3f372/zumoPreBuilt.git
RUN mkdir -p ./projects/zumo/upload/ ./projects/empty/upload/
RUN cp -r ./zumoPreBuilt/* ./projects/zumo/
#RUN rm -rf ./zumoPreBuilt/
#Set folder permissions to limit the bots write access to only required directories
RUN chown -R 1500:1500 ./*
RUN chmod ug+rx ./*
RUN chmod ug+rwx ./projects/*/upload/ ./projects/temp/
#install Node libraries
RUN npm install
#execute command to start the bot
CMD [ "node", "codebot.js" ]
#After building the image you can run it as a background proces with the command: 
#'docker run -d --restart unless-stopped node-docker' from the terminal...

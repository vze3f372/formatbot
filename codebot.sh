#!/bin/sh

useradd -u 1500 bot

git clone https://github.com/vze3f372/formatbot.git
cd formatbot/
mkdir -p ./projects/zumo/upload/ ./projects/empty/upload/
git clone https://github.com/vze3f372/zumoPreBuilt.git ./projects/zumo/
rm -rf ./zumoPreBuilt/
chmod ug+rx ./*
chmod gu+rwx ./projects/*/upload

npm install

echo Remember to copy config.json file to the formatbot directory... 

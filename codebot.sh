#!/bin/sh

useradd -u 1500 bot

git clone https://github.com/vze3f372/formatbot.git
cd formatbot/
git clone https://github.com/vze3f372/zumoPreBuilt.git

mkdir -p ./projects/zumo/upload ./projects/empty/upload
cp -r ./zumoPreBuilt/* ./projects/zumo
rm -rf ./zumoPreBuilt/
chmod ug+rx ./*
chmod gu+rwx ./projects/*/upload

npm install

echo Remember to copy config.json file to the formatbot directory... 

'use strict';

require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();

const TOKEN = process.env.TOKEN;
const formatter = require('./formatter');


client.login(TOKEN);

client.on('ready', () => {
	console.info(`Logged in as formatbot!`);
});


client.on('message', msg => {
	if (formatter.installed() && msg.channel.id == process.env.CHANNEL) {
		formatter.getFormattedCode(msg.content).then(code => msg.reply("\n```cpp\n" + code + "\n```")).catch(error => console.error());
	
	}

});

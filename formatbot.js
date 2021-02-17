require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const TOKEN = process.env.TOKEN;

client.login(TOKEN);

client.on('ready', () => {
	  console.info(`Logged in as formatbot!`);
});


client.on('message', msg => {
	  if (msg.content === 'ping') {
		      msg.reply('pong');
		      msg.channel.send('pong');
		    }
});

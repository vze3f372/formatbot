const Discord = require('discord.js');
const client = new Discord.Client();

client.login('ODExNTI4ODU5MTY5MzI1MDc2.YCzhJQ.3nYxpLM0freM6BX37fhSIxH68_o');

client.on('ready', () => {
	  console.info(`Logged in as formatbot!`);
});


client.on('message', msg => {
	  if (msg.content === 'ping') {
		      msg.reply('pong');
		      msg.channel.send('pong');
		    }
});

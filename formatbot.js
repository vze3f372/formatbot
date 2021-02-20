'use strict';

require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();

const TOKEN = process.env.TOKEN;
const formatter = require('./lib/formatter');
const syntaxChecker = require('./lib/syntax-checker');


client.login(TOKEN);

client.on('ready', () => {
	console.info(`Logged in as formatbot!`);
});


client.on('message', msg => {
	if (msg.author.id === client.user.id) {
		return;
	}

	if (msg.channel.id === process.env.CHANNEL) {
		msg.reply('Working, please wait...')
			.then(reply => {
				msg.delete();

				formatter.format(msg.content)
					.then(code => {
						const replyContent =
							'<@' + msg.author.id + '>,' +
							'```cpp\n' +
							code + '\n' +
							'```\n';
						reply.edit(replyContent + 'Building...');

						syntaxChecker.checkCode(msg.content)
							.then(warnings => reply.edit(replyContent +
								'Build successful! Warnings:\n' + (warnings || 'None!')))
							.catch(err => reply.edit(replyContent + 'Build failed:\n' + err));
					})
					.catch(err => {
						msg.reply('Failed to format the message:\n' + msg.content);
						console.error('Failed to format the message:', msg.content, 'Reason:', err);
					});
			});
	}
});

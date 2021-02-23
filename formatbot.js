'use strict';

const Discord = require('discord.js');
const client = new Discord.Client();

const configurer = require('./lib/configurer');
const formatter = require('./lib/formatter');
const syntaxChecker = require('./lib/syntax-checker');

configurer.setDefaults({
	token: 'your_token_here',
	admins: [],
	projects: [],
	channels: []
});


configurer.load().then(config => {
	client.login(config.token);

	client.on('ready', () => {
		console.info(`Logged in as formatbot!`);
		for(const channelID of config.channels){
			console.info(`${channelID}`);
			client.channels.resolve(channelID).send(config.welcome[Math.floor(Math.random() * config.welcome.length)]);
		}
	});

	client.on('message', msg => {
		if (msg.author.id === client.user.id) {
			// Message sent by the bot, ignoring
		} else if (!config.channels.some(channel => channel.id === msg.channel.id)) {
			// Channel not added, ignoring
		} else {
			msg.reply('Working, please wait...').then(reply => {
				msg.delete();

				formatter.format(msg.content).then(code => {
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
				}).catch(err => {
					msg.reply('Failed to format the message:\n' + msg.content + '\n' +
						'Reason: ' + err);
				});
			});
		}
	});
});


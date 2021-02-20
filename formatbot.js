'use strict';

const path = require('path');

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
	});

	client.on('message', message => {
		if (message.author.id === client.user.id) {
			// Message sent by the bot, ignoring
		} else if (!config.channels.includes(message.channel.id)) {
			// Channel not added, ignoring
		} else {
			message.reply('Working, please wait...').then(reply => {
				message.delete();

				formatter.format(message.content).then(code => {
					const replyContent =
						'<@' + message.author.id + '>, Your code:' +
						'```cpp\n' +
						code + '\n' +
						'```\n';
					reply.edit(replyContent + 'Building...');

					const project = config.projects.find(p => p.channels.includes(message.channel.id));
					let promise;
					if (project) {
						promise = syntaxChecker.checkProject(path.resolve(project.root), message.content);
					} else {
						promise = syntaxChecker.checkCode(message.content);
					}
					promise
						.then(warnings => reply.edit(replyContent +
							':white_check_mark:  Build successful! Warnings:\n' + (warnings || 'None!')))
						.catch(err => reply.edit(replyContent + ':no_entry:  Build failed:\n' + err));
				}).catch(err => {
					message.reply(':warning:'.repeat(3) +
						' Failed to format the message:\n' +
						message.content + '\n' +
						'Reason: ' + err);
				});
			});
		}
	});
});


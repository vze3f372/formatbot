'use strict';

const Discord = require('discord.js');
const client = new Discord.Client();

const configurer = require('./lib/configurer');
const formatter = require('./lib/formatter');
const files = require('./lib/file-manager');
const syntaxChecker = require('./lib/syntax-checker');

const config = configurer();

config.setDefaults({
	token: 'your_token_here',
	admins: [],
	projects: [],
	channels: []
});


config.load().then(config => {
	client.login(config.token);

	client.on('ready', () => {
		console.info(`Logged in as formatbot!`);
	});

	client.on('message', message => {
		if (message.author.id === client.user.id) {
			// Message sent by the bot, ignoring
		} else if (message.content.startsWith('!')) {
			if (config.admins.includes(message.author.id)) {
				// Handle admin commands
			}
			// Handle user commands
		} else if (!config.channels.includes(message.channel.id)) {
			// Channel not added, ignoring
		} else {
			message.reply('Working, please wait...').then(reply => {
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
						if (message.attachments.size) {
							const sourceFile = message.attachments.find(a => a.url.match(/.*\.c(pp)?$/));
							const sourceArchive = message.attachments.find(a => a.url.match(/.*\.zip$/));

							if (sourceFile.url) {
								promise = files.cleanDirectory(project.upload)
									.then(() => files.downloadFile(sourceFile.url, project.upload))
									.then(() => syntaxChecker.checkProject(project.root))
									.then(() => message.delete());
							}
						} else {
							promise = new Promise((resolve, reject) => reject('Please upload a file ' +
								'or .zip archive with your code'));
						}
					} else {
						if (message.attachments.size) {
							promise = new Promise((resolve, reject) => reject('This channel does not support files'));
						} else {
							promise = syntaxChecker.checkCode(message.content);
						}
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


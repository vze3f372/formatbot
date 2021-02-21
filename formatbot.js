'use strict';

const Discord = require('discord.js');
const client = new Discord.Client();

const configurer = require('./lib/configurer');
const formatter = require('./lib/formatter');
const files = require('./lib/file-manager');
const syntaxChecker = require('./lib/syntax-checker');

const configFile = configurer();

configFile.setDefaults({
	token: 'your_token_here',
	admins: [],
	projects: [],
	channels: []
});


configFile.load().then(config => {
	client.login(config.token);

	client.on('ready', () => {
		console.info(`Logged in as FormatBot!`);
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
			const attachments = message.attachments.array();
			message.channel.send('Working, please wait...', attachments).then(reply => {
				formatter.format(message.content).then(code => {
					const replyContent =
						'<@' + message.author.id + '>, Your code:' +
						'```cpp\n' +
						code + '\n' +
						'```\n';
					reply.edit(replyContent + 'Building...');

					let promise;
					const project = config.projects.find(p => p.channels.includes(message.channel.id)) ??
						config.projects.find(p => p.name === 'empty');

					if (attachments.length) {
						const sourceFile = attachments.find(a => a.url.match(/.*\.c(pp)?$/));
						const sourceArchive = attachments.find(a => a.url.match(/.*\.zip$/));

						if (sourceFile) {
							promise = files.cleanDirectory(project.upload)
								.then(() => files.downloadFile(sourceFile.url, project.upload))
								.then(() => syntaxChecker.checkProject(project.root));
						} else if (sourceArchive) {
							// download, unarchive, build
							promise = new Promise((resolve, reject) => reject('Archives are not yet supported'));
						} else {
							promise = new Promise((resolve, reject) => reject('File type not supported'));
						}
					} else {
						promise = syntaxChecker.checkCode(message.content);
					}
					promise
						.then(warnings => reply.edit(replyContent +
							':white_check_mark:  Build successful! Warnings:\n' + (warnings || 'None!')))
						.catch(err => reply.edit(replyContent + ':no_entry:  Build failed:\n' + err));
				})
					.catch(err => reply.edit('<@' + message.author.id + '>, Your message: \n"' +
						message.content + '"\n' +
						':warning:  Could not be formatted!\n' +
						'Reason: ' + err))
					.then(() => message.delete());
			});
		}
	});
});


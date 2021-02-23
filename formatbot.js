'use strict';

const Discord = require('discord.js');
const client = new Discord.Client();

const configurer = require('./lib/configurer');
const formatter = require('./lib/formatter');
const fm = require('./lib/file-manager');
const syntaxChecker = require('./lib/syntax-checker');

const config = configurer();

config.defaults = {
	token: 'your_token_here',
	admins: [],
	projects: [],
	channels: []
};


config.load().then(config => {
	client.login(config.token);

	client.on('ready', () => {
		console.info(`Logged in as formatbot!`);
		for (const channelID of config.channels) {
			client.channels.resolve(channelID)
				.send(config.welcome[Math.floor(Math.random() * config.welcome.length)]);
		}
	});

	client.on('message', message => {
		if (message.author.id === client.user.id) {
			// Message sent by the bot, ignoring
		} else if (message.content.startsWith('!formatbot ')) {
			const words = message.content.match(/\b\w+\b/g);
			const commands = [
				{
					name: 'chadd',
					admin: true,
					cb: () => {
						if (!config.channels.includes(message.channel.id)) {
							config.channels.push(message.channel.id);
							config.save();
							message.reply('Channel added!');
						}
					}
				},
				{
					name: 'chdel',
					admin: true,
					cb: () => {
						config.channels.splice(config.channels.indexOf(message.channel.id));
						config.save();
						message.reply('Channel removed!');
					}
				},
				{
					name: 'chlist',
					admin: true,
					cb: () => {
						message.reply('List of FormatBot channels:\n' +
							config.channels.join('\n'));
					}
				},
				{
					name: 'promote',
					admin: true,
					cb: () => {
						if (!config.admins.includes(words[2])) {
							config.admins.push(words[2]);
							config.save();
							message.reply('User promoted!');
						}
					}
				},
				{
					name: 'demote',
					admin: true,
					cb: () => {
						config.admins.splice(config.admins.indexOf(words[2]));
						config.save();
						message.reply('User demoted!');
					}
				},
				{
					name: 'prset',
					admin: true,
					cb: () => {
						const project = config.projects.find(p => p.name === words[2]);
						for (const p of config.projects) {
							if (p !== project) {
								p.channels.splice(p.channels.indexOf(message.channel.id));
							}
						}
						if (project) {
							project.channels.push(message.channel.id);
							message.reply('Project for this channel is set to "' + project.name + '"!');
						} else {
							message.reply('Project not found, using empty project.');
						}
						config.save();
					}
				},
				{
					name: 'admins',
					admin: true,
					cb: () => {
						message.reply('List of FormatBot admins:\n' +
							config.admins.join('\n'));
					}
				},
				{
					name: 'ahelp',
					admin: true,
					cb: () => {
						message.reply('Admin commands help\n' +
							'!formatbot chadd - Adds the current channel to FormatBot\n' +
							'!formatbot chdel - Removes the current channel from FormatBot\n' +
							'!formatbot chlist - Lists channels added to FormatBot\n' +
							'!formatbot promote [id] - Sets user as admin\n' +
							'!formatbot demote [id] - Removes the user from admins\n' +
							'!formatbot admins - Lists all the admins of FormatBot' +
							'!formatbot prset - Sets the project to use for current channel\n' +
							'!formatbot ahelp - Shows this page\n' +
							'!formatbot help - Shows user help page');
					}
				},
				{
					name: 'help',
					cb: () => {
						message.reply('FormatBot help\n' +
							'Just send me your code and I\'ll format it and check it for any errors!\n' +
							'!formatbot help - Shows this page\n' +
							'!formatbot ahelp - Shows admin help page');
					}
				}
			];
			const command = commands.find(c => c.name === words[1]);
			if (!command) {
				message.reply('Command not found');
			} else if (command.admin && !config.admins.includes(message.author.id)) {
				message.reply('This command requires admin permissions');
			} else {
				command.cb();
			}
		} else if (!config.channels.includes(message.channel.id)) {
			// Channel not added, ignoring
		} else {
			const attachments = message.attachments.array();
			message.channel.send('Working, please wait...', attachments).then(reply => {
				formatter.format(message.content).then(code => {
					const replyContent =
						'<@' + message.author.id + '>,' +
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
							promise = fm.cleanDirectory(project.upload)
								.then(() => fm.downloadFile(sourceFile.url, project.upload))
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


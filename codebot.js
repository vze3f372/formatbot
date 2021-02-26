'use strict';

const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client();

const configurer = require('./lib/configurer');
const fm = require('./lib/file-manager');
const formatter = require('./lib/formatter');
const syntaxChecker = require('./lib/syntax-checker');

const config = configurer();
let jobPromise = Promise.resolve();

config.defaults = {
	token: 'your_token_here',
	admins: [],
	projects: [],
	channels: []
};


config.load().then(config => {
	client.login(config.token);


	client.on('ready', () => {
		console.info('Logged in as CodeBot!');
		if (config.welcome.enabled) {
			for (const channelID of config.channels) {
				client.channels.resolve(channelID)
					.send(config.welcome.phrases[Math.floor(Math.random() * config.welcome.phrases.length)]);
			}
		}
	});


	client.on('message', message => {
		if (message.author.id === client.user.id) {
			// Message sent by the bot, ignoring
		} else if (message.content.startsWith('!codebot ')) {
			handleCommands(message);
		} else if (!config.channels.includes(message.channel.id)) {
			// Channel not added, ignoring
		} else {
			jobPromise = jobPromise
				.then(() => processMessage(message));
		}
	});


	function handleCommands(message) {
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
					message.reply('List of CodeBot channels:\n' +
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
						message.reply('Project for this channel is set to ' + project.name + '!');
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
					message.reply('List of CodeBot admins:\n' +
						config.admins.join('\n'));
				}
			},
			{
				name: 'version',
				cb: () => {
					configurer('./package.json').load().then(pkg => {
						message.reply('CodeBot version: ' + pkg.version);
					});
				}
			},
			{
				name: 'ahelp',
				admin: true,
				cb: () => {
					message.reply('CodeBot admin help\n' +
						'!codebot chadd - Adds the current channel to CodeBot\n' +
						'!codebot chdel - Removes the current channel from CodeBot\n' +
						'!codebot chlist - Lists channels added to CodeBot\n' +
						'!codebot promote [id] - Sets user as admin\n' +
						'!codebot demote [id] - Removes the user from admins\n' +
						'!codebot admins - Lists all the admins of CodeBot' +
						'!codebot prset - Sets the project to use for current channel\n' +
						'!codebot ahelp - Shows this page\n' +
						'!codebot help - Shows user help page');
				}
			},
			{
				name: 'help',
				cb: () => {
					message.reply('CodeBot help\n' +
						'Just send me your code and I\'ll format it and check it for any errors!\n' +
						'!codebot help - Shows this page\n' +
						'!codebot ahelp - Shows admin help page\n' +
						'!codebot version - Shows bot version');
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
	}


	function processMessage(message) {
		return message.channel.send('Building, please wait...')
			.then(reply => {
				message.channel.startTyping(1);
				processCode(message)
					.finally(() => reply.delete());
			})
			.finally(() => message.delete())
			.finally(() => message.channel.stopTyping(true));
	}


	function processCode(message) {
		let promise = Promise.resolve();
		const project = config.projects.find(p => p.channels.includes(message.channel.id)) ??
			config.projects.find(p => p.name === 'empty');

		promise = promise
			.then(() => fm.cleanDirectory(project.upload))
			.then(() => fm.cleanDirectory(config.tempDir));

		const attachments = message.attachments.array();
		if (attachments.length) {
			const sourceFile = attachments.find(a => a.url.match(/.*\.c(pp)?$/));
			const sourceArchive = attachments.find(a => a.url.match(/.*\.zip$/));
			if (sourceFile) {
				promise = promise
					.then(() => fm.downloadFile(sourceFile.url, project.upload))
					.then(() => syntaxChecker.checkProject(project.root));
			} else if (sourceArchive) {
				promise = promise
					.then(() => fm.cleanDirectory(project.upload))
					.then(() => fm.downloadFile(sourceArchive.url, config.tempDir))
					.then(() => fm.unArchive(config.tempDir + sourceArchive.name, project.upload))
					.then(() => syntaxChecker.checkProject(project.root));
			} else {
				promise = promise
					.then(() => Promise.reject('File type not supported'));
			}
		} else {
			promise = promise
				.then(() => fm.saveToFile(project.upload + 'upload.cpp', message.content))
				.then(() => formatter.format(message.content))
				.then(formattedCode => message.content = formattedCode)
				.then(() => syntaxChecker.checkProject(project.root));
		}
		return reply(message, project, promise);
	}


	function reply(message, project, promise) {
		const archivePath = config.tempDir + 'CodeBot.zip';
		let buildStatus = 'failed';
		let output = '';

		return promise
			.then(warnings => {
				if (warnings) {
					output = warnings;
					fm.saveToFile(project.upload + 'warnings.txt', warnings);
					buildStatus = 'warnings';
				} else {
					buildStatus = 'ok';
				}
			})
			.catch(err => {
				if (err) {
					output = err.toString();
					fm.saveToFile(project.upload + 'errors.txt', err.toString());
				}
			})
			.then(() => message.content? fm.saveToFile(project.upload + 'message.txt',
				message.content) : null)
			.then(() => fm.archive(project.upload, archivePath))
			.then(() => {
				let messageText = '<@' + message.author.id + '>, your message:\n';
				if (message.content.length < 1000) {
					if (message.attachments.size) {
						messageText += '"' + message.content + '"\n';
					} else {
						messageText += '```cpp\n' + message.content + '\n```\n';
					}
				} else {
					messageText += '[too long, see archive]\n';
				}
				messageText += 'Has been built. Build results:\n';
				switch (buildStatus) {
					case 'failed':
						messageText += ':no_entry:  Build failed\n';
						break;
					case 'warnings':
						messageText += ':warning:  Build succeeded with warnings\n';
						break;
					case 'ok':
						messageText += ':white_check_mark:  Build succeeded, no warnings!\n';
						break;
				}
				if (output.length) {
					if (output.length < 500) {
						messageText += 'Build output: "' + output + '"\n';
					} else {
						messageText += 'Build output too long, see archive.\n';
					}
				}
				messageText += 'See attached archive for more details';

				return message.channel.send(messageText,
					new Discord.MessageAttachment(fs.createReadStream(archivePath)));
			});
	}
});

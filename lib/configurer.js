// Shared library by MStefan99

'use strict';

const path = require('path');
const fs = require('fs');


module.exports = function(filePath='./config.json') {
	let defaults = {};

	let configReadable = null;
	let configWritable = null;
	let directoryWritable = null;


	function setDefaults(options) {
		defaults = options;
	}


	function setFilePath(configPath) {
		filePath = configPath;
	}


	function isReadable() {
		return new Promise(resolve => {
			if (configReadable === null) {
				fs.access(path.resolve(filePath), fs.constants.R_OK, err => {
					resolve(configReadable = !err);
				});
			} else {
				resolve(configReadable);
			}
		});
	}


	function isWritable() {
		return new Promise(resolve => {
			if (configWritable === null) {
				fs.access(path.resolve(filePath), fs.constants.W_OK, err => {
					resolve(configWritable = !err);
				});
			} else {
				resolve(configWritable);
			}
		});
	}


	function isDirectoryWritable() {
		return new Promise(resolve => {
			if (directoryWritable === null) {
				fs.access(path.dirname(path.resolve(filePath)), fs.constants.W_OK, err => {
					resolve(directoryWritable = !err);
				});
			} else {
				resolve(directoryWritable);
			}
		});
	}


	function load() {
		return new Promise((resolve, reject) => {
			isReadable().then(readable => {
				if (readable) {
					fs.readFile(path.resolve(filePath), 'utf8', (err, data) => {
						resolve(Object.assign({}, defaults, JSON.parse(data)));
					});
				} else {
					reject('Config not readable');
				}
			});
		});
	}


	function save(optionsToSave) {
		return new Promise((resolve, reject) => {
			const options = Object.assign(defaults, optionsToSave);
			isWritable().then(writable => {
				if (writable) {
					fs.writeFile(path.resolve(filePath), JSON.stringify(options),
						'utf8', err => {
							if (err) {
								reject('Failed to write config');
							}
						});
				} else {
					isDirectoryWritable().then(writable => {
						if (writable) {
							fs.writeFile(path.resolve(filePath), JSON.stringify(options),
								'utf8', err => {
									if (err) {
										reject('Failed to create config');
									}
								});
						} else {
							reject('Config directory not writable');
						}
					});
				}
			});
		});
	}


	return {
		setDefaults,
		setFilePath,
		load,
		save
	};
};

'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');


function downloadFile(url, dirPath) {
	const fullPath = path.resolve(dirPath);
	return new Promise((resolve, reject) => {
		fs.access(fullPath, fs.constants.W_OK, err => {
			if (err) {
				reject(err);
			} else {
				const fileName = url.replace(/.*\//, '');
				https.get(url, res => {
					res.pipe(fs.createWriteStream(fullPath));

					res.on('end', () => resolve());
				}).on('error', err => {
					reject(err);
				});
			}
		});
	});
}


function cleanDirectory(dirPath) {
	const fullPath = path.resolve(dirPath);
	return new Promise((resolve, reject) => {
		fs.rm(fullPath, {
			force: true,
			recursive: true
		}, err => {
			if (err) {
				reject(err);
			} else {
				fs.mkdir(fullPath, {recursive: true}, err => {
					if (err) {
						reject(err);
					} else {
						resolve();
					}
				});
			}
		});
	});
}


function saveToFile(filePath, contents) {
	const fullPath = path.resolve(filePath);
	return new Promise((resolve, reject) => {
		fs.access(path.dirname(fullPath), err => {
			if (err) {
				reject(err);
			} else {
				fs.writeFile(filePath, contents, err => {
					if (err) {
						reject(err);
					} else {
						resolve();
					}
				});
			}
		});
	});
}


module.exports = {
	cleanDirectory,
	downloadFile,
	saveToFile
};

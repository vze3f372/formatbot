'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');


function downloadFile(url, dirPath) {
	return new Promise((resolve, reject) => {
		fs.access(path.resolve(dirPath), fs.constants.W_OK, err => {
			if (err) {
				reject(err);
			} else {
				const fileName = url.replace(/.*\//, '');
				https.get(url, res => {
					res.pipe(fs.createWriteStream(path.resolve(dirPath, fileName)));

					res.on('end', () => resolve());
				}).on('error', err => {
					reject(err);
				});
			}
		});
	});
}


function cleanDirectory(dirPath) {
	return new Promise((resolve, reject) => {
		fs.readdir(path.resolve(dirPath), (err, files) => {
			if (err) {
				reject(err);
			} else {
				for (const file of files) {
					fs.rm(path.resolve(dirPath, file), {
						force: true,
						recursive: true
					}, err => {
						if (err) {
							reject(err);
						} else {
							resolve();
						}
					});
				}
			}
		});
	});
}


module.exports = {
	downloadFile,
	cleanDirectory
};

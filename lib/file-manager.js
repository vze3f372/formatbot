'use strict';

const https = require('https');
const childProcess = require('child_process');
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


function archive(dirPath, archivePath) {
	return new Promise((resolve, reject) => {
		childProcess.exec('zip -q -r ' +
			path.resolve(archivePath) + ' ./*', {
			cwd: path.resolve(dirPath)
		}, err => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}


function unArchive(archivePath, dirPath) {
	return new Promise((resolve, reject) => {
		childProcess.exec('unzip -q ' +
			path.resolve(archivePath) + ' -d ' +
			path.resolve(dirPath), err => {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}


module.exports = {
	cleanDirectory,
	downloadFile,
	saveToFile,
	unArchive,
	archive
};

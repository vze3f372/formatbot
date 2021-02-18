'use strict';

/* Usage
 * First run installed() to check whether formatter is installed and usable.
 * If everything is fine, the function should return true.
 *
 * To get formatted code, call format() with the unformatted code and wait until it resolves.
 * To format a file, call formatFromFile() and wait until it resolves.
 *
 * Both functions reject if formatter fails.
 */


const childProcess = require('child_process');
const path = require('path');


let formatterInstalled = null;


function init() {
	return new Promise(resolve => {
		childProcess.exec('clang-format --version', err => {
			resolve(formatterInstalled = !err);
		});
	});
}


function installed() {
	return new Promise(resolve => {
		if (formatterInstalled === null) {
			init().then(res => resolve(res));
		} else {
			resolve(formatterInstalled);
		}
	});
}


function format(code) {
	return new Promise((resolve, reject) => {
		const formatProcess = childProcess.exec('clang-format');
		formatProcess.stdin.write(code);
		formatProcess.stdin.end();

		handleProcessOutputAndExit(formatProcess, resolve, reject);
	});
}


function formatFile(filePath) {
	return new Promise((resolve, reject) => {
		const formatProcess = childProcess.exec('clang-format ' +
			path.resolve(__dirname, filePath));

		handleProcessOutputAndExit(formatProcess, resolve, reject);
	});
}


function handleProcessOutputAndExit(formatProcess, resolve, reject) {
	let formattedCode = '';
	let err = '';

	formatProcess.stdout.on('data', chunk => formattedCode += chunk);
	formatProcess.stderr.on('data', chunk => err += chunk);

	formatProcess.on('close', exitCode => {
		if (!exitCode) {
			resolve(formattedCode);
		} else {
			reject(err);
		}
	});
}


module.exports = {
	installed,
	format,
	formatFile
};

'use strict';

/* Usage
 *
 * To get formatted code, call format() with the unformatted code and wait until it resolves with the result.
 * To format a file, call formatFromFile() and wait until it resolves.
 * Both functions reject if formatter fails.
 *
 * Please always use absolute paths!
 */


const childProcess = require('child_process');


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
		const formatProcess = childProcess.exec('clang-format ' + filePath);

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
	format,
	formatFile
};

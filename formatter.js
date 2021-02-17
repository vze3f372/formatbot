'use strict';

/* Usage:
 * First run installed() to check whether clang-format is installed and usable.
 * If everything is fine, the function should return true.
 *
 * To get formatted code, call getFormattedCode() with the unformatted code and wait until it resolves.
 */


const childProcess = require('child_process');
// clang -fsyntax-only -x c++ -


function installed() {
	const formatProcess = childProcess.exec('clang-format', err => {
		if (err) {
			console.error('Clang-format is not installed, exiting...');
			return false;
		}
	});

	formatProcess.stdin.end();
	return true;
}


function getFormattedCode(code) {
	return new Promise((resolve, reject) => {
		const formatProcess = childProcess.exec('clang-format');
		formatProcess.stdin.write(code);
		formatProcess.stdin.end();

		let formattedCode = '';
		formatProcess.stdout.on('data', chunk => {
			formattedCode += chunk;
		});

		formatProcess.on('close', (exitCode, signal) => {
			if (!exitCode) {
				resolve(formattedCode);
			} else {
				reject(signal);
			}
		})
	});
}


module.exports = {
	installed,
	getFormattedCode
};

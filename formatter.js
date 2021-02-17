'use strict';

const childProcess = require('child_process');


function init() {
	const formatProcess = childProcess.exec('clang-format', err => {
		if (err) {
			console.error('Clang-format is not installed, exiting...');
			process.exit(~0);
		}
	});

	formatProcess.stdin.end();
}


function getFormattedCode() {
	return new Promise((resolve, reject) => {

	});
}


module.exports = {
	init,
	getFormattedCode
};

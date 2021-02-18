'use strict';

// clang -fsyntax-only -x c++ -

const childProcess = require('child_process');
const path = require('path');

let compilerInstalled = null;


function init() {
	return new Promise(resolve => {
		const formatProcess = childProcess.exec('clang', err => {
			resolve(compilerInstalled = !err);
		});

		formatProcess.stdin.end();
	});
}


function installed() {
	return new Promise(resolve => {
		if (compilerInstalled === null) {
			init().then(() => resolve(compilerInstalled));
		} else {
			resolve(compilerInstalled);
		}
	});
}


function checkCode(code) {
	return new Promise((resolve, reject) => {

	});
}


function checkDirectory(buildDirectory) {
	return new Promise((resolve, reject) => {
		buildDirectory? resolve() : reject();
	});
}


module.exports = {
	installed,
	checkCode,
	checkDirectory
};

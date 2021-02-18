'use strict';

const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');


let compilerInstalled = null;
const projects = {};


function init() {
	return new Promise(resolve => {
		childProcess.exec('clang -v', err => {
			resolve(compilerInstalled = !err);
		});
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


function loadProjects(basePath) {

}


function checkCode(code) {
	return new Promise((resolve, reject) => {
		const compilerProcess = childProcess.exec('clang -fsyntax-only -x c++ -');
		compilerProcess.stdin.write(code);
		compilerProcess.stdin.end();

		handleCompilerOutput(compilerProcess, resolve, reject);
	});
}


function checkProject(projectName) {
	return new Promise((resolve, reject) => {
		projectName? resolve() : reject();
	});
}


function handleCompilerOutput(compilerProcess, resolve, reject) {
	let formattedCode = '';
	let err = '';

	compilerProcess.stdout.on('data', chunk => formattedCode += chunk);
	compilerProcess.stderr.on('data', chunk => err += chunk);

	compilerProcess.on('close', exitCode => {
		if (!exitCode) {
			resolve();
		} else {
			reject(err);
		}
	});
}


module.exports = {
	installed,
	checkCode,
	checkProject
};

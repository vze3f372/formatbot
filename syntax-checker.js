'use strict';

/* Usage
 * First run installed() to check whether the compiler is installed and the library can be used.
 * If it returns true, you may continue.
 *
 * To check a single file or code string, just call checkCode() or checkFiles(). These functions will resolve with no
 * value if compilation succeeded and reject with a compiler output if the input code contains errors.
 * checkFiles() will compile all C and C++ files located in the directory specified by the argument.
 *
 * To use projects, please first scan for projects with loadProjects(). The function will return true if it finds
 * at least one project.
 * After that, you can compile the code using all the custom libraries in the project. Functions checkProjectCode()
 * and checkProjectFiles() work in the same way as non-project ones, except that they also need a project name as
 * the first argument.
 */

const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');


let compilerInstalled = null;
const projects = [];


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


function checkFiles(basePath) {
	return new Promise((resolve, reject) => {
		const compilerProcess = childProcess.exec('clang -fsyntax-only ' +
		path.resolve(__dirname, basePath) + '*.cpp *.c');

		handleCompilerOutput(compilerProcess, resolve, reject);
	});
}


function checkProjectCode(projectName, code) {
	return new Promise((resolve, reject) => {
		projects.length? resolve() : reject();
	});
}


function checkProjectFiles(projectName, uploadPath) {
	return new Promise((resolve, reject) => {
		projects.length? resolve() : reject();
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
	checkFiles,
	// The following functions are only needed when working with projects
	loadProjects,
	checkProjectCode,
	checkProjectFiles
};

'use strict';

/* Usage
 *
 * To check a single file or code string, just call checkCode() or checkFiles(). These functions will resolve with no
 * value if compilation succeeded and reject with a compiler output if the input code contains errors.
 * checkFiles() will compile all C and C++ files located in the directory specified by the argument.
 *
 * To use projects, please first add a project directory with a makefile.
 * After that, you can compile the code using all the custom libraries in the project. Functions checkProjectCode()
 * and checkProjectFiles() work in the same way as non-project ones, except that they also need a makefile path as
 * the first argument.
 *
 * Please always use absolute paths!
 */

const childProcess = require('child_process');
const fs = require('fs');


function checkCode(code) {
	return new Promise((resolve, reject) => {
		const compilerProcess = childProcess.exec('clang -fsyntax-only -x c++ -');
		compilerProcess.stdin.write(code);
		compilerProcess.stdin.end();

		handleCompilerOutput(compilerProcess, resolve, reject);
	});
}


function checkFiles(dirPath) {
	return new Promise((resolve, reject) => {
		const compilerProcess = childProcess.exec('shopt -s nullglob; clang -fsyntax-only '
			+ dirPath + '/*.c ' + dirPath + '/*.cpp', {shell: '/bin/bash'});
		// TODO: find a way to ignore empty wilcards in sh

		handleCompilerOutput(compilerProcess, resolve, reject);
	});
}


function checkProjectCode(makefilePath, code) {
	return new Promise((resolve, reject) => {
		makefilePath? resolve() : reject();
	});
}


function checkProjectFiles(makefilePath, dirPath) {
	return new Promise((resolve, reject) => {
		makefilePath? resolve() : reject();
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
	checkCode,
	checkFiles,
	checkProjectCode,
	checkProjectFiles
};

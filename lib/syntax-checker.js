'use strict';

/* Usage
 *
 * To check a single file or code string, just call checkCode() or checkFiles(). These functions will resolve with no
 * value if compilation succeeded and reject with a compiler output if the input code contains errors.
 * checkFiles() will compile all C and C++ files located in the directory specified by the argument.
 *
 * To use projects, please first add a project directory with a makefile.
 * After that, you can compile the code using all the custom libraries in the project. Functions checkProjectCode()
 * and checkProject() work in the same way as non-project ones, except that they also need the project directory
 * path as the first argument.
 *
 * Please always use absolute paths!
 */

const childProcess = require('child_process');


function checkCode(code) {
	return new Promise((resolve, reject) => {
		const compilerProcess = childProcess.exec('clang -Wall -fsyntax-only -x c++ -',
			{uid: 1500, gid: 1500});
		compilerProcess.stdin.write(code);
		compilerProcess.stdin.end();

		handleCompilerOutput(compilerProcess, resolve, reject);
	});
}


function checkProject(projectPath) {
	return new Promise((resolve, reject) => {
		const makeProcess = childProcess.exec('make -C '
			+ projectPath + ' -f ' + projectPath + '/Makefile',
			{uid: 1500, gid: 1500});

		handleCompilerOutput(makeProcess, resolve, reject);
	});
}


function handleCompilerOutput(compilerProcess, resolve, reject) {
	let err = '';

	compilerProcess.stderr.on('data', chunk => err += chunk);
	compilerProcess.on('close', exitCode => {
		if (!exitCode) {
			resolve(err);
		} else {
			reject(err);
		}
	});
}


module.exports = {
	checkCode,
	checkProject
};

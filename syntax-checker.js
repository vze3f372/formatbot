'use strict';

// clang -fsyntax-only -x c++ -


function installed() {

}


function checkCode(code) {
	return new Promise((resolve, reject) => {
		code? resolve() : reject();
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

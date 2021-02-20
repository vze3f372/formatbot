'use strict';

const path = require('path');

const formatter = require('../formatter');
const syntaxChecker = require('../syntax-checker');


(async () => {
	console.log('\n\nChecking formatter...');
	console.log('Trying to format sample code...');
	console.log('Result:', await formatter.format(`#include "ardUI.h"

void ardUI::
setViewName(View
    * view, const String
  & name) {viewMap[name
                  ] = view;}View* ardUI::
          getViewByName(const String
                                                  & name) {
            return 
            viewMap[
                                     name
            ]
            ;
}void ardUI::
                                  back(
)



{
    ActivityManager::
                      back()
    ;
}void ardUI::
          reset(
) {                    ActivityManager::
    reset()
    ;}`)
		.catch(err => console.error('Failed, reason:', err)));

	console.log('\n\nChecking compiler...');
	console.log('Trying to compile sample code...');
	await syntaxChecker.checkCode(`
	#include <cstdio>
	#include <iostream>
	
	int main() {
		return 0;
	}
	`)
		.then(() => console.log('Success!'))
		.catch(err => console.error('Failed, reason:', err));

	console.log('Trying to compile sample Make project...');
	await syntaxChecker.checkProject(path.resolve(__dirname, '..', 'projects', 'empty'))
		.then(() => console.log('Success!'))
		.catch(err => console.error('Failed, reason:', err));
})();

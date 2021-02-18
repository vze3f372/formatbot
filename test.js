'use strict';

const formatter = require('./formatter');
const syntaxChecker = require('./syntax-checker');


(async () => {
	console.log('\n\nChecking formatter...');
	console.log('Checking clang-format support:', await formatter.installed());
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
	console.log('Checking clang support:', await syntaxChecker.installed());
	console.log('Trying to compile sample code...');
	syntaxChecker.checkCode(`
	#include <cstdio>
	#include <iostream>
	
	int main() {
		return 0;
	}
	`)
		.then(() => console.log('Success!'))
		.catch(err => console.error('Failed to compile sample code:', err));
})();

'use strict';

const argumented = require('../lib/argumented');

argumented.description('Test script');
argumented.add('verbose', '-v', null, 'verbose');
argumented.add('single', ['-s', '--single-arg'], 'argValue', 'single argument');
argumented.add('double', ['-d', '--double-arg'], ['arg1', 'arg2'], 'double arg');
const args = argumented.parse();

console.log(args);

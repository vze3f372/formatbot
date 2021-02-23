'use strict';

const configurer = require('../lib/configurer');

const config = configurer('./options.json');


config.number = 1;
config.string = 'hello';
config.object = {a: 1};
config.array = [1, 2, 3, 5];


(async () => {
	await config.load();
	console.log(config);

	await config.save();
})();

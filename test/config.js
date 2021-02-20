'use strict';

const configurer = require('../lib/configurer');

configurer.setDefaults({
	number: 1,
	string: 'hello',
	object: {a: 1},
	null: null
});
configurer.setFilePath('./options.json');


configurer.save({})
	.then(() => {
		configurer.load();
	})
	.then(options => console.log(options));

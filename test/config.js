'use strict';

const configurer = require('../lib/configurer');

const config = configurer('./options.json');


config.setDefaults({
	number: 1,
	string: 'hello',
	object: {a: 1},
	null: null
});


config.save({})
	.then(() => {
		config.load();
	})
	.then(options => console.log(options));

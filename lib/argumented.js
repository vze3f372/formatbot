'use strict';

const argEntries = [];
const helpArgs = ['-h', '--help'];
const name = process.argv[1].match(/[^<>:"/\\|?*]+$/)[0];
let desc = '';


// Help will be executed when parsing
add('help', helpArgs, null, 'Show this page');


function makeEntry(name, args, params, desc, required = false) {
	if (!(args instanceof Array)) {
		args = [args];
	}
	if (params && !(params instanceof Array)) {
		params = [params];
	}
	return {name, args, params, desc};
}


function printHelpPage() {
	let invocation = '';
	let paramDesc = '';

	for (const entry of argEntries) {
		invocation += ' [' + entry.args.join('/') + (entry.params? ' ' + entry.params.join(' ') : '') + ']';

		paramDesc += '\t' + entry.args.join(', ') + (entry.params? '\t' + entry.params.join(' ') : '') +
			'\t' + entry.desc + '\n';
	}

	console.log(desc + '\n\n' +
		'Usage:\n' +
		'\tnode ./' + name + invocation + '\n\n' +
		'Options:\n' +
		paramDesc);
	process.exit();
}


function description(description) {
	desc = description;
}


function add(name, args, params = null, description = '') {
	if (!args) {
		throw new Error('No arguments provided');
	}
	if (!args instanceof Array) {
		args = [args];
	}
	argEntries.push(makeEntry(name, args, params, description));
}


function has(args) {
	if (!args instanceof Array) {
		args = [args];
	}

	return args.some(arg => process.argv.includes(arg));
}


function parse() {
	const args = {
		positional: []
	};

	const argv = process.argv.slice(2);
	for (let i = 0; i < argv.length; ++i) {
		const entry = argEntries.find(e => e.args.includes(argv[i]));
		if (entry) {
			if (entry.name === 'help') {
				printHelpPage();
			}
			if (!entry.params?.length) {
				args[entry.name] = true;
			} else if (entry.params.length === 1) {
				args[entry.name] = argv[++i];
			} else {
				args[entry.name] = {};
				for (const param of entry.params) {
					args[entry.name][param] = argv[++i];
				}
			}
		} else {
			args.positional.push(argv[i]);
		}
	}

	return args;
}


module.exports = {
	description,
	add,
	parse
};

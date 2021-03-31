const { spawn } = require( 'child_process' );
const rl = require( 'readline' )

const parser = require( './utility/args_parse.js' );
const argv = parser( process.argv.slice(2) );

const options = {
	purchaser: {
		Mode: 'Automatic slave purchasement',
		Src: './purchaser.js',

		Arguments: [ '--maxcost', '--ignoreSlaved' ]
	},
	scrapper: {
		Mode: 'User scrapping',
		Src: './scrapper.js',

		Arguments: [ '--userId', '--maxcost', '--loop', '--autobind' ],
	},
	binder: {
		Mode: 'Auto-binding for your slaves',
		Src: './binder.js',

		Arguments: [ '--userId', '--cyclic' ]
	},
	booster: {
		Mode: 'Boosts your bots',
		Src: './booster.js',

		Arguments: [ 'No arguments provided (Currently)' ]
	}
}

const mode = argv['bot-mode'];

if ( argv.length == 0 || mode == null ) {
	console.log( '\x1b[1m\x1b[33mVK-Slaves bot@2.1.6\n\n\x1b[0m\x1b[33m' );
	console.log( 'Here is the list of available options:' );

	let option_index = 0;
	for ( let key in options ) {
		console.log( 
			'\x1b[36m[\x1b[32m' + (++option_index) + '\x1b[36m]\x1b[33m' + '\t\x1b[47m\x1b[30m' + key + '\x1b[0m\x1b[33m:', '\t',
			options[key].Mode, '\x1b[35m(' + options[key].Src + ')\x1b[33m' 
		)

		if (options[key].Arguments) {
			console.log( '\t╚ Arguments:', options[key].Arguments )
		}

		console.log('')
	}

	console.log( '\x1b[0m' );
	console.log( '\nTo launch bot in one of those modes, make sure to use --bot-mode argument in command line.' )
	console.log( '\x1b[1mExample: node index --bot-mode=purchaser\x1b[0m' )
} else {
	if ( options[mode] ) {
		let object = options[mode];

		console.log('\n\x1b[43m\x1b[30m STARTING \x1b[0m\n');

		let proc = spawn( 'node', [ object.Src ].concat( process.argv.slice( 3 ) ), {detached: true, shell: true} );
		proc.stdout.on( 'data', data => console.log('\x1b[1m\x1b[33m[BOT]\x1b[0m', data.toString()) );
		proc.stderr.on( 'data', error => console.log(error.toString()) );
		proc.on( 'close', code => {if ( code == 0 ) { console.log('\x1b[42m\x1b[30m Execution Finished \x1b[0m'); } else { console.log('\x1b[41m\x1b[30m Execution Failed \x1b[0m'); } } );
	}
}
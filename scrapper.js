const { FetchUserSlaves, BuySlave, JobSlave, BindSlave } = require( './wrapper/wrap.js' );
const parser = require( './utility/args_parse.js' );
const config = require( './config/cfg.js' )

const argv = parser( process.argv.slice(2) );

const auth = config.authHeader;

let display_cfg = config
display_cfg.authHeader = '***PRIVATE***'

console.log( '\x1b[36mCoded by @sdam64 (https://github.com/sdam64). Feel free to fork it :3\n\x1b[0m' )
console.log( 'Launching bot instance.' );
console.log( 'Bot config:', display_cfg, '\n\n^^^^ if anything here is wrong, edit file in ./config/cfg.js\n' );

const max_cost = argv['maxcost'] ?? config.maxPriceScrap;
console.log( 'max_cost:', max_cost )

async function $( s ) {
	return new Promise( function(resolve) {
		setTimeout( resolve, s * 1000 );
	});
}

async function Scrap( ids ) {
	// console.log(ids)
	return new Promise( function( resolve ) {
		var slave = 0;
		let parse = setInterval( async ()=> {
			console.log(slave, ids.length)
			if (slave >= ids.length - 1) {
				resolve();
				clearInterval( parse );
			} else {
				slave++;
			}

			var object = ids[slave];

			if (object == undefined) {
				console.log( 'Shutting down current worker due to error, refreshing.' )
				clearInterval(parse);
				resolve();

				let details = await FetchUserSlaves( argv['userId'] );
				if ( details.slaves.length > 0 ) {
					await Scrap(details.slaves);
				} else {
					console.log( '\x1b[31mTarget has no slaves!\x1b[0m' );
				}
			}

			if (object.price <= max_cost) {
				console.log( `\x1b[33mBuying user/${object.id}...` );
				await $(0.5);
				let buy_details = await BuySlave( object.id );

				if ( buy_details.error != undefined ) {
					console.log( `\x1b[31mUnable to buy user/${object.id} due to: ${buy_details.error.message}\x1b[0m` );
				} else {
					console.log( `\x1b[32mSuccessfuly bought slave. Setting their job...` );
					await $(1.5);
					let job_details = await JobSlave( object.id, config.defaultJob );

					if (job_details.error != undefined) {
						console.log( '\x1b[31mFailed to set the job due to: ' + job_details.error.message + '\x1b[0m' );
					}

					await $(1.5);

					if ( object.fetter_price <= config.maxPriceBind && argv['autobind'] == 1 ) {
						await BindSlave( object.id );
						console.log( `\x1b[32mTAKT!\x1b[0m` );
					}
				}
			} else {
				console.log( `\x1b[31mUnable to buy user/${object.id} due to: too expensive (>${max_cost})\x1b[0m` );
			}
		}, config.checkDelay * 1000 )
	});
}

if ( argv['userId'] != undefined ) {
	(async() => {
		const userId = argv['userId'];
		console.log( `\x1b[33mRetrieving details on user/${userId}...\x1b[0m` );

		let details = await FetchUserSlaves( userId );
		if ( details.slaves != undefined ) {
			if ( details.slaves.length > 0 ) {
				await $(2);
				while (true) {
					let _details = await FetchUserSlaves( argv['userId'] );
					await $(2);
					await Scrap(_details.slaves);

					if (argv['loop'] != 1 || _details.slaves.length <= 0) {
						break;
					}
				}
			} else {
				console.log( '\x1b[31mTarget has no slaves!\x1b[0m' );
			}
		} else {
			console.log(details);
		}
		setTimeout( _ => process.exit( 0 ), 15000 );
	})();
}
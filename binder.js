const config = require( './config/cfg.js' );
const { FetchUserSlaves, BindSlave } = require( './wrapper/wrap.js' );

const parser = require( './utility/args_parse.js' );
const argv = parser( process.argv.slice(2) );

async function $( s ) {
	return new Promise( function(resolve) {
		setTimeout( resolve, s * 1000 );
	});
}

async function CycleBind( list, from ) {
	return new Promise( function( resolve ){
		var slave_id = 0 ?? from;
		var tick = setInterval(
			async () => {
				let slave = list[slave_id];

				if ( slave == undefined ) {
					clearInterval( tick );
					console.log( `\x1b[31mLoop interrupted. Restarting...\x1b[0m` );

					resolve();
				}

				if (slave.fetter_to == 0) {
					if ( slave.fetter_price <= config.maxPriceBind ) {
						let res = await BindSlave( slave.id );

						if ( res.error != undefined ) {
							console.log( `\x1b[31mUnable to buy user/${slave.id} due to: ${res.error.message}\x1b[0m` );
						} else {
							console.log( `\x1b[32mSuccessfuly fettered slave user/${slave.id}` );
						}
					} else {
						console.log( `\x1b[31mIgnoring user/${slave.id} due to: fetter expensivity ${slave.fetter_price}\x1b[0m` );
					}
				} else {
					console.log( `\x1b[31mIgnoring user/${slave.id} due to: already fettered\x1b[0m` );
				}

				slave_id++;

				if (slave_id > list.length) {
					resolve();
					clearInterval( tick );
				}
			},

			config.checkDelay * 1000
		);
	});
}

(async() => {
	let d = await FetchUserSlaves( config.defaultUserID );

	await $( 5.5 );

	while (true) {
		await CycleBind( d.slaves );

		await $( 2 );
	}

	setTimeout( _ => process.exit( 0 ), 15000 );
})();
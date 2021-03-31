const { BuySlave, FetchObject, FetchDetails, JobSlave } = require( './wrapper/wrap.js' );
const config = require( './config/cfg.js' );

const auth = config.authHeader;

let display_cfg = config
display_cfg.authHeader = '***PRIVATE***'

// console.log( ('\n').repeat( 10 ) )
console.log( '\x1b[36mCoded by @sdam64 (https://github.com/sdam64). Feel free to fork it :3\n\x1b[0m' )
console.log( 'Launching bot instance.' );
console.log( 'Bot config:', display_cfg );

console.log( '\n^^^^ if anything here is wrong, edit file in ./config/cfg.js\n' );


(async () => {
	// let beginFrom = 221624
	let beginFrom = config.startId // from what number the bot will buy slaves
	let worker = setInterval( async function() {
		// {
			let slave = await FetchObject( beginFrom );

			if (!slave.hasMaster) {
				if ( slave.price <= config.maxPriceBulk ) {
					if ( config.logParams.display_checkLog ) {
						console.log( '\x1b[32mUserID(' + beginFrom + ') has succesfully passed every condition. Attempting to buy...' );
					}

					let buy_details = await BuySlave( beginFrom );
					
					if ( buy_details.error ) {
						if ( buy_details.error.message == 'ErrFloodBuy app_error' ) {
							if ( config.logParams.display_checkLog ) {
								console.log( '\x1b[31mYou\'ve been buying bots too fast and have been blocked by Slave\'s api. Try launching bot later.\x1b[0m' );
								
								clearInterval( worker );
								require( 'process' ).exit(0)
							}
						}
						console.log( '\x1b[31mFailed to buy slave due to: ' + buy_details.error.message + '\x1b[0m' );
					} else {
						await JobSlave( beginFrom, config.defaultJob );
					}
				} else {
					if ( config.logParams.display_checkLog ) {
						console.log( '\x1b[31mUserID(' + beginFrom + ') has a price (' + slave.price + ') above the restricted one. Continuing.\x1b[0m' );
					}
				}
			} else {
				if ( config.logParams.display_checkLog ) {
					console.log( '\x1b[31mUserID(' + beginFrom + ') has a master. Continuing.\x1b[0m' );
				}
			}

		// }

		beginFrom++;
	}, config.checkDelay * 1000 )
})();
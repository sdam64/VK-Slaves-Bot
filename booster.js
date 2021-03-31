const { FetchUserSlaves, BuySlave, JobSlave, SaleSlave, BindSlave, FetchDetails } = require( './wrapper/wrap.js' );
const parser = require( './utility/args_parse.js' );
const config = require( './config/cfg.js' );
const fs = require( 'fs' );
const util = require( 'util' );

console.log(config.defaultJob)


const argv = parser( process.argv.slice(2) );
const userID = argv[ 'userId' ] ?? config.defaultUserID;

function baseLog( y, x ) {
	return Math.log( y ) / Math.log( x )
}

function RemainingBoosts( current_price, needed_price ) {
	return (current_price < needed_price) ? Math.round(baseLog( needed_price / 40, 1.5 ) - baseLog( current_price / 40, 1.5 )) + 1 : 0;
}

async function $( s ) {
	return new Promise( function(resolve) {
		setTimeout( resolve, s * 1000 );
	});
}

async function BoostSlave( userID ) {
	let price = (await FetchDetails( userID )).price;

	if ( price != undefined ) {
		console.log( 'Estimated price: ', Math.ceil( 40 * 1.5**16 ) )
		console.log( 'Current price: ', price );

		let remaining_boosts = RemainingBoosts( price, 40 * 1.5**16 );

		if ( remaining_boosts > 0 ) {
			console.log( 'Allowed to boost user/'+ userID, 'by', remaining_boosts, 'times.' );

			await $(1);
			for ( var i = 0; i < remaining_boosts; i++ ) {
				let sale = await SaleSlave( userID );
				
				await $( 1.5 );
				
				let buy = await BuySlave( userID );

				if ( buy.error != undefined || sale.error != undefined ) {
					console.log( i, 'Saled?', sale.error == undefined, (sale.error != undefined ? sale.error : '') );
					console.log( i, 'Bought?', buy.error == undefined, (buy.error != undefined ? buy.error : '') );
					break;
				} else {
					console.log( i + 1, 'success' )
				}

				await $( 1.5 );
			}

			let job = await JobSlave( userID, '@bot' );
			await $(2.5);
			let bind = await BindSlave( userID );

			console.log( 'Successfully boosted a bot', job );
			console.log( 'Has it binded? ', bind )
		}

		else { console.log( 'Current price exceeds estimated, skipping.' ) }
	} 

	else { console.log( 'skipping' ) }
}

let startID = config.startId + Math.floor( Math.random() * 10000 );

async function BulkPurchase() {
	let i = 0;
	let goods = 0;
	console.log( 'Launching bulk purchase...' );
	return new Promise(async function(resolve){
		while (goods < 50) {
			let details = await FetchDetails( startID + i );
			// console.log(details)

			console.log( 'Checking', startID + i, 'price is: ', details.price );

			if (details.price < 350) {
				await $(0.5);

				let buy = await BuySlave( startID + i );
				if (buy.error == undefined) {
					console.log( 'purchased', startID + i, (goods + 1) + '/50' );
					goods++;
				}
			}

			i++;
			await $(1.5);
		}

		resolve();
		startID += i;
	});
}

(async() => {
	// console.log( slaves_list );

	await BulkPurchase();

	while (true) {
		let slaves_list = await FetchUserSlaves( userID );

		for ( let index in slaves_list.slaves ) {
			let slave = slaves_list.slaves[index];

			console.log( 'Boosting', slave.id );

			if ( slave.price >= 40 * 1.5**17 ) {
				console.log( 'already boosted' )
				
				continue;
			}

			await BoostSlave( slave.id );

			await $( 1 );
		}
		await $( 5 );
		await BulkPurchase();

		await $( 5 );
	}

	console.log( 'Hanging on thread...' );
	setTimeout( () => {}, 10000 );
})();
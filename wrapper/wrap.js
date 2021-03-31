const fetch = require( 'node-fetch' )
const auth = require( '../config/cfg.js' ).authHeader;
const ua = require( '../config/cfg.js' ).userAgent;

async function FetchDetails( userID ) {
	return new Promise(function(resolve){
		fetch("https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/user?id=" + userID, {
			"headers": {
				"accept": "application/json, text/plain, */*",
				"accept-language": "",
				"authorization": auth,
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "cross-site",

				'user-agent': ua,
				"referrer": "",
				'origin': '',
			},
			"referrer": "",
			'origin': '',
			"referrerPolicy": "strict-origin-when-cross-origin",
			"body": null,
			"method": "GET",
			"mode": "cors"
		}).then( _ => _.json().then(resolve) );
	})
}
async function BuySlave( userID ) {
	return new Promise(function(resolve){
		fetch("https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/buySlave", {
		  "headers": {
		    "accept": "application/json, text/plain, */*",
		    "accept-language": "",
		    "authorization": auth,
		    "content-type": "application/json",
		    "sec-ch-ua-mobile": "?0",
		    "sec-fetch-dest": "empty",
		    "sec-fetch-mode": "cors",
		    "sec-fetch-site": "cross-site",

		    "user-agent": ua,
		    "referrer": "",
			'origin': '',
		  },
		  "referrer": "",
		  'origin': '',
		  "referrerPolicy": "strict-origin-when-cross-origin",
		  "body": "{\"slave_id\":" + userID + "}",
		  "method": "POST",
		  "mode": "cors"
		}).then( _ => _.json().then(resolve) );
	})
}

async function FetchObject( userID ) {
	let response = await FetchDetails( userID );
	return {
		hasMaster: response.master_id != 0,
		price: response.price,
	}
}

async function JobSlave( userID, jobName ) {
	return new Promise(function(resolve) {
		fetch("https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/jobSlave", {
		  "headers": {
			"accept": "application/json, text/plain, */*",
			"accept-language": "",
			"authorization": auth,
			"content-type": "application/json",
			"sec-ch-ua-mobile": "?0",
			"sec-fetch-dest": "empty",
			"sec-fetch-mode": "cors",
			"sec-fetch-site": "cross-site",

			"user-agent": ua,
			"referrer": "",
		  	'origin': '',
		  },
		  "referrer": "",
		  'origin': '',
		  "referrerPolicy": "strict-origin-when-cross-origin",
		  "body": "{\"slave_id\":" + userID + ",\"name\":\"" + jobName + "\"}",
		  "method": "POST",
		  "mode": "cors"
		}).then(r => r.json().then(resolve));
	});
}

async function FetchUserSlaves( userID ) {
	return new Promise(function(resolve){
		fetch("https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/slaveList?id=" + userID, {
		  "headers": {
		    "accept": "application/json, text/plain, */*",
		    "accept-language": "",
		    "authorization": auth,
		    "content-type": "application/json",
		    "sec-fetch-dest": "empty",
		    "sec-fetch-mode": "cors",
		    "sec-fetch-site": "cross-site",

		    "user-agent": ua,
		    "referrer": "",
			'origin': '',
		  },
		  "referrer": "",
		  'origin': '',
		  "referrerPolicy": "strict-origin-when-cross-origin",
		  "body": null,
		  "method": "GET",
		  "mode": "cors"
		}).then( r => r.json().then(resolve) );
	})
}

async function BindSlave( userID ) {
	return new Promise( function(resolve){
		fetch("https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/buyFetter", {
			"headers": {
				"accept": "application/json, text/plain, */*",
				"accept-language": "",
				"authorization": auth,
				"content-type": "application/json",
				"sec-ch-ua-mobile": "?0",
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "cross-site",

				"user-agent": ua,
				"referrer": "",
		 		'origin': '',

			},
			"referrer": "",
		    'origin': '',
			"referrerPolicy": "strict-origin-when-cross-origin",
			"body": "{\"slave_id\":" + userID + "}",
			"method": "POST",
			"mode": "cors",
			"credentials": "include"
		}).then( r => r.json().then( resolve ) );
	});
}

async function SaleSlave( userID ) {
	return new Promise( function(resolve){		
		fetch("https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/saleSlave", {
			"headers": {
				"accept": "application/json, text/plain, */*",
				"accept-language": "",
				"authorization": auth,
				"content-type": "application/json",
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "cross-site",

				"user-agent": ua,
				"referrer": "",
		  		'origin': '',
			},
			"referrer": "",
		    'origin': '',
			"referrerPolicy": "strict-origin-when-cross-origin",
			"body": "{\"slave_id\":" + userID + "}",
			"method": "POST",
			"mode": "cors",
			"credentials": "include"
		}).then( r => r.json().then(resolve) );
	});
}

async function MySlaves() {
	return new Promise( function(resolve){
		fetch("https://pixel.w84.vkforms.ru/HappySanta/slaves/1.0.0/start", {
			"headers": {
				"accept": "application/json, text/plain, */*",
				"accept-language": "",
				"authorization": auth,
				"sec-fetch-dest": "empty",
				"sec-fetch-mode": "cors",
				"sec-fetch-site": "cross-site",

				'user-agent': ua,
				"referrer": "",
		    	'origin': '',
			},
			"referrer": "",
		    'origin': '',
			"referrerPolicy": "strict-origin-when-cross-origin",
			"body": null,
			"method": "GET",
			"mode": "cors"
		});
	});
}

module.exports = {
	FetchDetails: FetchDetails,
	FetchObject: FetchObject,
	BuySlave: BuySlave,
	JobSlave: JobSlave,
	FetchUserSlaves: FetchUserSlaves,
	BindSlave: BindSlave,
	SaleSlave: SaleSlave,
	MySlaves: MySlaves
}
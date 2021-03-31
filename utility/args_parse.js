function RetrieveArgs( argv ) {
	let result = {};

	for ( let arg in argv ) {
		let split = argv[arg].split( '=' );
		result[split[0].substring(2)] = split[1];
	}

	return result;
}

module.exports = RetrieveArgs;
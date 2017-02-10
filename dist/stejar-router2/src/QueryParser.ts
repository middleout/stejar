export class QueryParser {

	/**
	 * @param qstr
	 * @returns {{}}
	 */
	static toObject( qstr: string ) {
		var query = {};
		var a     = (qstr[ 0 ] === '?' ? qstr.substr(1) : qstr).split('&');
		for ( var i = 0; i < a.length; i++ ) {
			var b = a[ i ].split('=');
			if ( decodeURIComponent(b[ 0 ]) ) {
				query[ decodeURIComponent(b[ 0 ]) ] = decodeURIComponent(b[ 1 ] || '');
			}
		}
		return query;
	}

	/**
	 * @param query
	 * @returns {string}
	 */
	static toString( query: Object ) {
		var str = "";
		Object.keys(query).forEach(key => str += encodeURIComponent(key) + "=" + encodeURIComponent(query[ key ]));
		return "?" + str;
	}
}

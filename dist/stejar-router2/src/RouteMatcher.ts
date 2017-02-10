import { RouteWithParent } from "./RouteWithParent";
import RouteMatcherLib from "route-parser";
import { RouteOptions } from "./RouteContract";
import { QueryParser } from "./QueryParser";

export class RouteMatcher extends RouteWithParent {

	/**
	 * @type {RouteMatcherLib}
	 */
	protected matcher: RouteMatcherLib;

	/**
	 * @param _options
	 * @param _parent
	 */
	constructor( protected _options: RouteOptions, protected _parent: RouteWithParent ) {
		super(_options, _parent);
		this.matcher = new RouteMatcherLib(_options.path);
	}

	/**
	 * @param path
	 * @return {any}
	 */
	match( path: string ): Object | false {
		let params = this.matcher.match(path);
		if ( !params ) {
			return false;
		}

		return params;
	}

	/**
	 * @param params
	 * @param query
	 * @return {string}
	 */
	buildUrl( params: Object, query: Object ) {
		return this.matcher.reverse(params) + (query ? QueryParser.toString(query) : "");
	}
}

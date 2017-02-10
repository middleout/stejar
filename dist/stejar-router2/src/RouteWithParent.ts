import { Route } from "./Route";
import { RouteOptions } from "./RouteContract";

export class RouteWithParent extends Route {

	/**
	 * @param _options
	 * @param _parent
	 */
	constructor( protected _options: RouteOptions, protected _parent: RouteWithParent ) {
		super(_options);
	}

	/**
	 * @return {RouteWithParent}
	 */
	get parent(): RouteWithParent {
		return this._parent;
	}
}

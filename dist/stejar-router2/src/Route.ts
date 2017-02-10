import { RouteOptions } from "./RouteContract";

export class Route {

	/**
	 * @param _options
	 */
	constructor( protected _options: RouteOptions ) {}

	/**
	 * @return {RouteOptions}
	 */
	get options(): RouteOptions {
		return this._options;
	}

	/**
	 * @return {string}
	 */
	get name(): string {
		return this.options.name;
	}

	/**
	 * @return {string}
	 */
	get path(): string {
		return this.options.path;
	}

	/**
	 * @return {Route[]|Array}
	 */
	get children(): Route[] {
		return this.options.children || [];
	}

	/**
	 * @return {Route[]|Array}
	 */
	get callback(): Function {
		return this.options.callback;
	}

	/**
	 * @return {Route[]|Array}
	 */
	get middleware(): Function {
		return this.options.middleware || (() => Promise.resolve());
	}
}

import { EVENTS } from "./Events";
import { MiddlewareResolver } from "./MiddlewareResolver";
import { ObjectEquals } from "./ObjectEquals";
import { Route } from "./Route";
import { RouteMatcher } from "./RouteMatcher";
import { RoutingAdapterContract } from "./RoutingAdapterContract";
import { RoutingTable } from "./RoutingTable";
const EventEmitter = require("wolfy87-eventemitter");

export class Router {

	protected routingTable: RoutingTable = new RoutingTable();

	/**
	 * @type {number}
	 */
	protected transitionId: number = 0;

	/**
	 * @type {RouteMatcher}
	 */
	protected currentRoute: RouteMatcher;

	/**
	 * @type {Object}
	 */
	protected currentParams: Object;

	/**
	 * @type {Object}
	 */
	protected currentQuery: Object;


	/**
	 * @type {EventEmitter}
	 */
	protected eventEmitter = new EventEmitter();

	/**
	 *
	 */
	protected middlewareResolver: MiddlewareResolver          = ( middleware: Function ) => ( fromState: any ) => middleware(fromState);

	/**
	 * @param adapter
	 */
	constructor( protected adapter: RoutingAdapterContract ) {}

	subscribe( event: EVENTS | "*", callback: Function ): void {
		if ( event === '*' ) {
			this.eventEmitter.addListener(EVENTS.ROUTE_NOT_MATCHED as any, ( ...args: any[] ) => {callback(EVENTS.ROUTE_NOT_MATCHED as any, ...args)});
			this.eventEmitter.addListener(EVENTS.ROUTE_MATCHED as any, ( ...args: any[] ) => {callback(EVENTS.ROUTE_MATCHED as any, ...args)});
			return;
		}

		this.eventEmitter.addListener(event as any, callback);
	}

	/**
	 * @param routes
	 * @return {Router}
	 */
	add( routes: Route | Route[] ): this {
		if ( !Array.isArray(routes) ) {
			routes = [ routes ];
		}

		routes.forEach(route => this.routingTable.insert(route));

		return this;
	}

	/**
	 * @param params
	 * @return {{}}
	 */
	protected combineCurrentParamsWithNewParams( params: Object ) {
		return {...this.currentParams, ...(params || {})};
	}

	/**
	 * @return {Promise<T>}
	 */
	start(): Promise<any> {
		return new Promise(( resolve ) => {
			this.adapter.start(( path, query ) => {
				let result = this.routingTable.match(path);
				if ( result ) {

					const route  = result[ 0 ];
					const params = result[ 1 ];

					this.currentRoute  = route;
					this.currentQuery  = query;
					this.currentParams = params;

					this.transitionId++;
					const currentTransition = this.transitionId;

					let middlewares: Function[] = [];

					middlewares.push(route.middleware || (() => Promise.resolve()));
					let routeParent = route.parent;

					while ( routeParent ) {
						middlewares.push(routeParent.middleware || (() => Promise.resolve()));
						routeParent = routeParent.parent;
					}

					const that = this;

					return (function ( currentTransition ) {
						return middlewares
							.reverse()
							.reduce(( prev, cur ) => prev.then(() => {
								if ( currentTransition === that.transitionId ) {
									return that.middlewareResolver(cur)({
										name: route.name,
										params,
										query
									});
								}

								return new Promise(resolve => null);

							}), Promise.resolve())
							.then(middlewareResult => that.eventEmitter.emit(EVENTS.ROUTE_MATCHED as any, route, {
								params,
								query,
								middlewareResult
							}))
							.then(() => resolve())
					})(currentTransition);
				}

				this.eventEmitter.emit(EVENTS.ROUTE_NOT_MATCHED);
			});
		});
	}

	/**
	 * @param name
	 * @param params
	 * @param query
	 * @return {boolean}
	 */
	protected isSameDestination( name: string, params: Object = {}, query: Object = {} ): boolean {
		if ( !this.currentRoute ) {
			return false;
		}

		if ( this.currentRoute.name !== name ) {
			return false;
		}

		let newParamsNames = Object.keys(params || {});

		let exists = true;
		newParamsNames.forEach(name => {
			if ( !this.currentParams[ name ] ) {
				exists = false;
			} else {
				if ( this.currentParams[ name ] !== params[ name ] ) {
					exists = false;
				}
			}
		});

		if ( !exists ) {
			return false;
		}

		if ( !ObjectEquals(this.currentQuery, query || {}) ) {
			return false
		}

		return true;
	}

	/**
	 * @param name
	 * @param params
	 * @param query
	 * @return {any}
	 */
	buildUrl( name?: string, params: Object                   = {}, query: Object = {} ): string {

		if ( !name ) {
			name = this.currentRoute.name;
		}

		let route = this.routingTable.findByName(name);
		if ( !route ) {
			throw new Error(`Could not find route with name ${name}`);
		}

		if ( !params ) {
			params = {};
		}

		params = this.combineCurrentParamsWithNewParams(params);

		const url = route.buildUrl(params, query);
		if ( url.indexOf('false') !== -1 ) {
			throw new Error(`Missing params for route ${name}`);
		}

		return url;
	}

	/**
	 * @param state
	 * @param params
	 * @param query
	 * @return {Promise<T>}
	 */
	navigate( state?: string, params: Object                  = {}, query: Object = {} ): void {
		if ( this.isSameDestination(state, params, query) ) {
			return;
		}

		const url = this.buildUrl(state, params, query);
		this.adapter.navigate(url);
	}

	/**
	 * @param params
	 */
	changeParams( params: Object ): void {
		return this.navigate(this.currentRoute.name, params, {});
	}

	/**
	 * @param query
	 */
	changeQuery( query: Object ): void {
		return this.navigate(null, {}, query);
	}

	/**
	 * @param resolver
	 * @return {Router}
	 */
	setMiddlewareResolver( resolver: MiddlewareResolver ): this {
		this.middlewareResolver = resolver;
		return this;
	}
}

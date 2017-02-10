import { Route } from "./Route";
import { RouteMatcher } from "./RouteMatcher";
import { RouteWithParent } from "./RouteWithParent";

export class RoutingTable {

	/**
	 * @type {Array}
	 */
	protected routes: Route[] = [];

	/**
	 * @type {Array}
	 */
	protected routeMatches: RouteMatcher[] = [];

	/**
	 * @type {{}}
	 */
	protected routesByName: { [name: string]: number } = {};

	/**
	 * @type {{}}
	 */
	protected routesByPath: { [name: string]: number } = {};

	/**
	 * @param route
	 * @param parentName
	 * @param parentPath
	 * @param directParent
	 * @return {RoutingTable}
	 */
	insert( route: Route, parentName?: string, parentPath?: string, directParent?: RouteWithParent ): this {

		let parentRoute = new RouteWithParent(route.options, directParent);

		if ( route.name && route.path ) {
			let name = route.name;
			if ( parentName ) {
				name = parentName + '.' + name;
			}

			let path = route.path;

			if ( parentPath ) {
				if ( parentPath[ parentPath.length - 1 ] === "/" ) {
					parentPath = parentPath.substr(0, parentPath.length - 2);
					path       = parentPath + path;
				} else {
					if ( path[ 0 ] !== "/" ) {
						path = parentPath + "/" + path;
					} else {
						path = parentPath + path;
					}
				}
			}

			let routeMatcher = parentRoute = new RouteMatcher({
				...route.options,
				name,
				path
			}, directParent);
			const idx = this.routes.push(parentRoute) - 1;
			this.routeMatches.push(routeMatcher);
			this.routesByName[ name ] = idx;
			this.routesByPath[ path ] = idx;
			route.children.forEach(child => this.insert(child, name, path, parentRoute));
		} else {
			route.children.forEach(child => this.insert(child, parentName, parentPath, parentRoute));
		}

		return this;
	}

	/**
	 * @param state
	 * @return {number|boolean}
	 */
	findByName( state: string ): RouteMatcher | false {
		return this.routeMatches[ this.routesByName[ state ] ] || false;
	}

	/**
	 * @param path
	 * @return {any}
	 */
	match( path: string ): [ RouteMatcher, Object ] | false {
		for ( var i = 0; i < this.routeMatches.length; i++ ) {
			const params = this.routeMatches[ i ].match(path);
			if ( params ) {
				return [ this.routeMatches[ i ], params ];
			}
		}

		return false;
	}
}

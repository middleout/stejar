import { Route } from "react-router";
import { cloneElement } from "react";
import { getRouteName } from "./getRouteName";

function redirector( toState: any, realRedirector: Function ) {
	return function ( options: any ) {
		if ( !options.params ) {
			options.params = toState.params;
		}
		if ( !options.name ) {
			options.name = getRouteName(toState.routes);
		}

		return realRedirector(options);
	}
}

export class MiddlewareRoute extends Route {

	/**
	 * @param route
	 * @returns {any}
	 */
	static createRouteFromReactElement( route: any ) {
		const createRouteFromReactElement = (Route as any).createRouteFromReactElement;
		if ( !route.props.middleware ) {
			return createRouteFromReactElement(route);
		}

		const onEnter = ( a: Object, b: Function, c: Function ) => {
			if ( route.props.middleware.onEnter ) {
				route.props.middleware.onEnter(a, redirector(a, b)).then(() => c());
			} else {
				c();
			}
		};

		const onChange = ( a: Object, b: Object, c: Function, d: Function ) => {
			if ( route.props.middleware.onChange ) {
				route.props.middleware.onChange(a, b, redirector(b, c)).then(() => d());
			} else {
				d();
			}
		};

		const overridenRoute = cloneElement(route, Object.assign({}, route.props, {
			onEnter : onEnter,
			onChange: onChange
		}));

		return createRouteFromReactElement(overridenRoute);
	}
}

import { Route } from "react-router";
import { cloneElement, createElement } from "react";
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

		let resolvedOnEnter: any  = null;
		let resolvedOnChange: any = null;

		const onEnter = ( a: Object, b: Function, c: Function ) => {
			if ( route.props.middleware.onEnter ) {
				route.props.middleware.onEnter(a, redirector(a, b)).then(( data: any ) => {
					resolvedOnEnter = data;
					return c()
				});
			} else {
				c();
			}
		};

		const onChange = ( a: Object, b: Object, c: Function, d: Function ) => {
			if ( route.props.middleware.onChange ) {
				route.props.middleware.onChange(a, b, redirector(b, c)).then(( data: any ) => {
					resolvedOnChange = data;
					return d();
				});
			} else {
				d();
			}
		};

		let overridenRoute = cloneElement(route, Object.assign({}, route.props, {
			onEnter : onEnter,
			onChange: onChange
		}));

		if ( overridenRoute.props.component ) {
			overridenRoute = cloneElement(overridenRoute, Object.assign({}, overridenRoute.props, {
				component: function ( props: any ) {
					return createElement(route.props.component, Object.assign({}, props, {data: resolvedOnChange || resolvedOnEnter}));
				},
			}));
		}

		return createRouteFromReactElement(overridenRoute);
	}
}

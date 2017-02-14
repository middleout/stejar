import { Children } from "react";
import { Route } from "@stejar/router-beta";
import { RouteProps } from "./Route";
/**
 * @param reactRoute
 * @return {Route}
 */
export function convertReactComponentRoutesToStandardRoutes( reactRoute: { props: RouteProps & { children: { props: RouteProps } } } ): Route {
	let routeOpts = {
		name      : reactRoute.props.name,
		path      : reactRoute.props.path,
		callback  : () => reactRoute.props.component,
		middleware: reactRoute.props.middleware,
		children  : [] as any[],
	};

	Children.forEach(reactRoute.props.children, ( child ) => {
		routeOpts.children.push(convertReactComponentRoutesToStandardRoutes(child as any));
	})

	return new Route(routeOpts);
}

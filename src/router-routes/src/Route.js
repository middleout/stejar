import { match } from "./Route/match";
import { reverseRoute } from "./Route/reverse";

/**
 * Make sure a route cannot have a name without path or a path without a name
 */
function validateNameAndPath(name, path) {
    if (name && !path) {
        throw new Error("Route cannot be built with a name and no path(s)");
    }

    if (path && !name) {
        throw new Error("Route cannot be built with path or path and no name");
    }
}

/**
 * Route factory
 */
function createRoute(
    { name = null, path = null, constraints = {}, exact = false, routes = [], ...options },
    parent = null
) {
    validateNameAndPath(name, path);
    if (path && typeof path !== "function") {
        const pathValue = path;
        path = () => pathValue;
    }

    const route = {
        name,
        parent,
        path,
        exact,
        constraints,
        reverse: (name, params, query) => reverseRoute(route, name, params, query),
        match: (path, query = {}) => match(route, path, {}, query),
        children: [],
        ...options,
    };

    route.children = routes.map(child => createRoute(child, route));
    return route;
}

/**
 * Route constructor
 *
 * A route can be constructed with a name and path or without both but not with either.
 * A route can have children specified by the "routes" param.
 * A route can be exact or not. Exact routes
 * A route can be passed any other options which will remain and be passed
 * to the match function.
 *
 * @constructor
 */
export const Route = constructor => {
    if (constructor.props) {
        throw new Error("A route cannot be created using a React spec. Did you forget to use convertRoutes() ?");
    }

    const { name = null, path = null, routes = [], exact = false, ...options } = constructor;

    return createRoute({ name, path, routes, exact, ...options });
};

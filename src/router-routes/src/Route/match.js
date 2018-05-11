import { RouteMatch } from "../RouteMatch";
import { enforceConstraints, parser } from "./parser";
import { accumulatePath, createPathParts } from "./pathHelpers";

/**
 * Matches a path to the route, while checking its children also.
 * It allows pathless routes to match by default
 */
export function match(route, matchPath, previousParams = {}, previousQuery = {}, previousRoutes = []) {
    // If the route does not have an identity just assume it matched
    if (!route.name) {
        return matchChildren(route.children, matchPath, previousParams, previousQuery, previousRoutes.concat(route));
    }

    // Match the route by tring the paths from the smallest unit to the last (accumulating)
    // ex:
    // /foo/bar => we try "/" then "/foo" then "/foo/bar"
    //
    // when we matched - the remaining is sent to the children
    const pathParts = createPathParts(matchPath);
    let accumulatedPath = "";

    while (pathParts.length > 0) {
        accumulatedPath = accumulatePath(accumulatedPath, pathParts.shift());
        const routePath = route.path(previousParams, previousQuery);

        if (!routePath) {
            continue;
        }

        const matchedParams = matchRouteToPath(routePath, accumulatedPath, route.constraints);

        if (!matchedParams) {
            continue;
        }

        // We matched until there are no more parts left to match
        if (pathParts.length === 0) {
            const routes = previousRoutes.concat(route);

            // Check here if this route has any EXACT children
            if (route.children.length > 0) {
                const exact = route.children.find(item => item.exact);
                if (exact) {
                    routes.push(exact);
                }
            }

            return RouteMatch({
                routes,
                params: { ...previousParams, ...matchedParams },
                query: previousQuery,
            });
        }

        const match = matchChildren(
            route.children,
            pathParts.join("/"),
            { ...previousParams, ...matchedParams },
            previousQuery,
            previousRoutes.concat(route)
        );

        if (match) {
            return match;
        }
    }

    return false;
}

/**
 * Used to run "matchRoute" on an array of routes and
 * stopping when the first match is found.
 */
function matchChildren(routes, matchPath, params, query, matchedRoutes) {
    for (let route of routes) {
        let matchResult = match(route, matchPath, params, query, matchedRoutes);
        if (matchResult) {
            return matchResult;
        }
    }

    return false;
}

function matchRouteToPath(routePath, matchPath, constraints) {
    const params = parser(routePath).match(matchPath);

    if (!params) {
        return false;
    }

    // eslint-disable-next-line no-unused-vars
    const { _, ...paramsWithout_ } = params;

    return enforceConstraints(paramsWithout_, constraints);
}

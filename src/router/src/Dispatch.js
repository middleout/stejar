import queryString from "query-string";
import { Events } from "./Events";
import { redirect } from "./redirect";

export function Dispatcher({ parsedRoutes, eventEmitter, history, setCurrentRoute, getCurrentRoute }) {
    return function dispatch(pathname, search, options = {}) {
        // Make sure it route doesn't end in "/"
        if (pathname !== "/" && pathname[pathname.length - 1] === "/") {
            history.push(pathname.substr(0, pathname.length - 1) + search);
            return;
        }

        // Parse the query string
        const query = queryString.parse(search, {
            arrayFormat: "bracket",
        });

        let routeMatch;

        for (let route of parsedRoutes) {
            // let currentParams = {};
            // if (getCurrentRoute()) {
            //     currentParams = getCurrentRoute().params;
            // }

            routeMatch = route.match(pathname, query);
            if (routeMatch) {
                break;
            }
        }

        // 404 not found
        if (!routeMatch) {
            eventEmitter.emit(Events.NOT_FOUND, { path: pathname, query });
            return;
        }

        routeMatch.options = options;

        setCurrentRoute(routeMatch);

        if (routeMatch.routes[routeMatch.routes.length - 1].redirect) {
            const redirection = routeMatch.routes[routeMatch.routes.length - 1].redirect;
            redirect(
                history,
                getCurrentRoute(),
                parsedRoutes,
                redirection.to,
                redirection.params,
                redirection.query,
                redirection.options
            );
            return;
        }

        eventEmitter.emit(Events.MATCHED, routeMatch);
    };
}

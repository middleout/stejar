import invariant from "invariant";
import { Route } from "@stejar/router-routes";
import { EventEmitter } from "fbemitter";
import { Dispatcher } from "./Dispatch";
import { Events } from "./Events";
import { buildPath } from "./buildPath";
import { redirect } from "./redirect";

export function Router({ routes, history, eventEmitter = new EventEmitter() }) {
    let isStarted = false;
    let parsedRoutes = [];
    let currentRoute = null;

    invariant(history, "A history object *is* required");
    invariant(routes, "A routes spec or array of specs *is* required");

    if (Array.isArray(routes)) {
        parsedRoutes = routes.map(route => Route(route));
    } else {
        parsedRoutes = [Route(routes)];
    }

    const dispatch = Dispatcher({
        parsedRoutes,
        eventEmitter,
        history,
        setCurrentRoute: route => (currentRoute = route),
        getCurrentRoute: () => currentRoute,
    });

    function subscribe(event, callback) {
        const token = eventEmitter.addListener(event, callback);
        return () => token.remove();
    }

    function once(event, callback) {
        const token = eventEmitter.once(event, callback);
        return () => token.remove();
    }

    function start(onInitialMatch = null) {
        if (isStarted) {
            return () => null;
        }

        isStarted = true;

        const unlisten = history.listen(location => dispatch(location.pathname, location.search, location.state));

        if (onInitialMatch) {
            once(Events.MATCHED, onInitialMatch.bind(onInitialMatch));
        }

        dispatch(history.location.pathname, history.location.search);
        return () => {
            eventEmitter.removeAllListeners(EventEmitter.MATCHED);
            eventEmitter.removeAllListeners(EventEmitter.NOT_FOUND);
            isStarted = false;
            unlisten();
        };
    }

    return {
        subscribe,
        once,
        buildPath: (to, params, query, options) => buildPath(currentRoute, parsedRoutes, to, params, query, options),
        redirect: (to, params, query, options) =>
            redirect(history, currentRoute, parsedRoutes, to, params, query, options),
        start,
    };
}

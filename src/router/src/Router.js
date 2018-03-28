import queryString from "query-string";
import { ensureContainerInterop } from "@stejar/interop";
import invariant from "invariant";
import { EventEmitter } from "@stejar/event-emitter";
import { RouteFactory } from "./RouteFactory";
import { Route } from "./Route";

export class Router {
    static MATCHED_EVENT = "MATCHED";
    static NOT_FOUND_EVENT = "NOT_FOUND";

    constructor(options) {
        this._routes = [];
        invariant(options.history, "A history object *is* required");
        this._serviceManager = options.serviceManager;
        this._history = options.history;
        this._eventEmitter = new EventEmitter();
        this._currentRoute = null;
        this._isStarted = false;

        if (this._serviceManager) {
            ensureContainerInterop(this._serviceManager);
            this._serviceManager.set(Router, this);
        }

        if (options.routes) {
            if (Array.isArray(options.routes)) {
                options.routes.forEach(route => this.add(route));
            } else {
                this.add(options.routes);
            }
        }
    }

    add(routeDefinition) {
        const route = RouteFactory.build(this, { ...routeDefinition, serviceManager: this._serviceManager });
        this._routes.push(route);
        return this;
    }

    subscribe(event, callback) {
        return this._eventEmitter.subscribe(event, callback);
    }

    once(event, callback) {
        return this._eventEmitter.once(event, callback);
    }

    getCurrentRoute() {
        return this._currentRoute;
    }

    start(onInitialMatch) {
        if (this._isStarted) {
            return () => null;
        }

        this._isStarted = true;

        const unlisten = this._history.listen(location => {
            this._dispatch(location.pathname, location.search);
        });

        if (onInitialMatch) {
            this.once(Router.MATCHED_EVENT, onInitialMatch.bind(onInitialMatch));
        }
        this._dispatch(this._history.location.pathname, this._history.location.search);
        return unlisten;
    }

    buildPath(to = null, params = {}, query = {}, options = {}) {
        if (!to) {
            invariant(
                this._currentRoute,
                process.env.NODE_ENV === "production"
                    ? undefined
                    : `You cannot build a path to the "current" route if the current route was not set up. This usually means you are trying to build a path before the first router match`
            );
            to = this._currentRoute.name;
        }

        const defaults = {
            reuseParams: true,
            reuseQuery: false,
        };

        options = { ...defaults, ...options };

        params = this._reuseDataIfConditionIsMet(
            options.reuseParams && this._currentRoute,
            this._currentRoute.params,
            params
        );
        query = this._reuseDataIfConditionIsMet(
            options.reuseQuery && this._currentRoute,
            this._currentRoute.query,
            query
        );

        let parts = to.split(".");
        for (let offset in this._routes) {
            const route = this._routes[offset];
            const result = route.reverse(parts, params, query);

            if (!result) {
                continue;
            }

            let queryAsString = "";
            if (Object.keys(query).length > 0) {
                queryAsString =
                    "?" +
                    queryString.stringify(query, {
                        arrayFormat: "bracket",
                    });
            }

            return result + queryAsString;
        }

        // TODO: when going to root/FOO and FOO is not a valid locale
        // TODO: and we redirect to root/FOO/tasks => and tasks uses FOO as locale
        // TODO: then it the locale route will try to build the URL to tasks with FOO
        // TODO: which will return NULL thus this will throw

        throw new Error(
            process.env.NODE_ENV === "production"
                ? `Could not build path to "${to}".`
                : `Cannot build a path to the "${to}" route. This most likely happened because the "${to}" route has a dynamic path which returned empty due to various reasons.`
        );
    }

    navigate(to = null, params = {}, query = {}, options = {}) {
        const parts = this.buildPath(to, params, query, options).split("?");
        this._history.push(
            parts[0],
            parts.length > 1 ? parts[1] : "",
            options.statusCode ? options.statusCode : undefined
        );
    }

    _reuseDataIfConditionIsMet(condition, data, current) {
        if (!condition) {
            return current;
        }

        return { ...data, ...current };
    }

    _dispatch(pathname, search) {
        // Make sure it route doesn't end in "/"
        if (pathname !== "/" && pathname[pathname.length - 1] === "/") {
            this._history.push(pathname.substr(0, pathname.length - 1) + search);
            return;
        }

        const query = queryString.parse(search, {
            arrayFormat: "bracket",
        });

        const parts = pathname.split("/").filter(item => !!item);
        parts.unshift("/");

        let routeMatch;

        for (let offset in this._routes) {
            const route = this._routes[offset];
            let currentParams = {};
            if (this._currentRoute) {
                currentParams = this._currentRoute.params;
            }
            routeMatch = route.match(parts, currentParams, query);
            if (routeMatch) {
                break;
            }
        }

        // 404 not found
        if (!routeMatch) {
            this._eventEmitter.dispatch(Router.NOT_FOUND_EVENT, { path: pathname, query });
            return;
        }

        this._currentRoute = {
            name: routeMatch.getName(),
            params: routeMatch.getParams(),
            query: routeMatch.getQuery(),
        };

        for (let offset in routeMatch.getRoutes()) {
            const route = routeMatch.getRoutes()[offset];
            if (route.getType() === Route.TYPE_REDIRECT) {
                const to = route.getOptions().$redirectionDetails;
                this.navigate(to.name, to.params, to.query, to.options);
                return;
            }
        }

        this._eventEmitter.dispatch(Router.MATCHED_EVENT, routeMatch);
    }
}

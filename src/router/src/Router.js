import queryString from "query-string";
import invariant from "invariant";
import { EventEmitter } from "@stejar/event-emitter/es/EventEmitter";
import { Stack } from "@stejar/promise-middleware/es/Stack";
import { RouteFactory } from "./RouteFactory";

export class Router {
    static MATCHED_EVENT = "MATCHED";
    static NOT_FOUND_EVENT = "NOT_FOUND";

    constructor(options) {
        this._routes = [];

        if (options.routes) {
            if (Array.isArray(options.routes)) {
                options.routes.forEach(route => this.add(route));
            } else {
                this.add(options.routes);
            }
        }

        invariant(options.history, "A history object *is* required");
        invariant(options.stateAdapter, "A state adapter *is* required");
        this._serviceManager = options.serviceManager;
        this._stateAdapter = options.stateAdapter;
        this._history = options.history;
        this._eventEmitter = new EventEmitter();

        if (this._serviceManager) {
            this._serviceManager.set(Router, this);
        }
    }

    add(routeDefinition) {
        const route = RouteFactory.build(this, routeDefinition, { serviceManager: this._serviceManager });
        this._routes.push(route);
        return this;
    }

    subscribe(event, callback) {
        return this._eventEmitter.subscribe(event, callback);
    }

    start() {
        const unlisten = this._history.listen(location => {
            this._dispatch(location.pathname, location.search);
        });

        this._dispatch(this._history.location.pathname, this._history.location.search);
        return unlisten;
    }

    buildPath(to = null, params = {}, query = {}, options = {}) {
        if (!to) {
            invariant(
                this._stateAdapter.hasCurrentRoute(),
                process.env.NODE_ENV === "production"
                    ? undefined
                    : `You cannot build a path to the "current" route if the current route was not set up. This usually means you are trying to build a path before the first router match`
            );
            to = this._stateAdapter.getCurrentRouteName();
        }

        const defaults = {
            reuseParams: true,
            reuseQuery: false,
        };

        options = { ...defaults, ...options };

        params = this._reuseDataIfConditionIsMet(
            options.reuseParams && this._stateAdapter.hasCurrentRoute(),
            this._stateAdapter.getCurrentParams.bind(this._stateAdapter),
            params
        );
        query = this._reuseDataIfConditionIsMet(
            options.reuseQuery && this._stateAdapter.hasCurrentRoute(),
            this._stateAdapter.getCurrentQuery.bind(this._stateAdapter),
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
        this._history.push(parts[0], parts.length > 1 ? parts[1] : "");
    }

    _reuseDataIfConditionIsMet(condition, method, current) {
        if (!condition) {
            return current;
        }

        const previousData = method();
        return { ...previousData, ...current };
    }

    _dispatch(pathname, search) {
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

        let stack = new Stack();
        this._routes.forEach(route => {
            let currentParams = {};
            if (this._stateAdapter.hasCurrentRoute()) {
                currentParams = this._stateAdapter.getCurrentParams();
            }
            routeMatch = route.match(parts, currentParams, query);

            if (routeMatch) {
                // Here we prepare the midlewares
                stack = new Stack();
                routeMatch.getRoutes().forEach(item => stack.add((...args) => item.runMiddleware(...args)));
            }
        });

        // 404 not found
        if (!routeMatch) {
            this._eventEmitter.dispatch(Router.NOT_FOUND_EVENT, { path: pathname, query });
            return;
        }

        const from = this._stateAdapter.hasPreviousRoute()
            ? {
                  name: this._stateAdapter.getPreviousRouteName(),
                  params: this._stateAdapter.getPreviousParams(),
                  query: this._stateAdapter.getPreviousQuery(),
              }
            : null;

        const to = {
            name: routeMatch.getName(),
            params: routeMatch.getParams(),
            query: query,
        };

        // Here we run the midlewares then update the state and notify everybody we finished
        stack.run(from, to).then(() => {
            this._stateAdapter.update(routeMatch.getName(), routeMatch.getParams(), query);
            this._eventEmitter.dispatch(Router.MATCHED_EVENT, routeMatch);
        });
    }
}

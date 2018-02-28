import queryString from "query-string";
import invariant from "invariant";
import { EventEmitter } from "@stejar/event-emitter/es/EventEmitter";
import { Stack } from "@stejar/promise-middleware/es/Stack";
import { RouteFactory } from "./RouteFactory";

export class Router {
    static MATCHED_EVENT = "MATCHED";
    static NOT_FOUND_EVENT = "NOT_FOUND";

    /**
     * @param options
     */
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
        this._stateAdapter = options.stateAdapter;
        this._history = options.history;
        this._eventEmitter = new EventEmitter();
    }

    /**
     * @param routeDefinition
     * @returns {Router}
     */
    add(routeDefinition) {
        const route = RouteFactory.build(this, routeDefinition);
        this._routes.push(route);
        return this;
    }

    /**
     * @param event
     * @param callback
     * @returns {function()}
     */
    subscribe(event, callback) {
        return this._eventEmitter.subscribe(event, callback);
    }

    /**
     * @returns {*}
     */
    start() {
        const unlisten = this._history.listen(location => {
            this._dispatch(location.pathname, location.search);
        });

        this._dispatch(this._history.location.pathname, this._history.location.search);
        return unlisten;
    }

    /**
     * @param to
     * @param params
     * @param query
     * @param options
     * @returns {string|boolean|Uint8Array|Uint16Array|Int16Array|Float32Array|*}
     */
    buildPath(to = null, params = {}, query = {}, options = {}) {
        if (!to) {
            if (!this._stateAdapter.hasCurrentRoute()) {
                throw new Error("Cannot create path to unknown route when the current route was not yet set.");
            }
            to = this._stateAdapter.getCurrentRouteName();
        }

        const defaults = {
            reuseParams: true,
            reuseQuery: false,
        };

        options = { ...defaults, ...options };

        if (options.reuseParams) {
            let currentParams = {};
            if (this._stateAdapter.hasCurrentRoute()) {
                currentParams = this._stateAdapter.getCurrentParams();
            }

            params = { ...currentParams, ...params };
        }
        if (options.reuseQuery) {
            let currentQuery = {};
            if (this._stateAdapter.hasCurrentRoute()) {
                currentQuery = this._stateAdapter.getCurrentParams();
            }

            query = { ...currentQuery, ...query };
        }

        let parts = to.split(".");
        for (let offset in this._routes) {
            const route = this._routes[offset];
            const result = route.reverse(parts, params, query);

            if (result) {
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
        }

        throw new Error(`Cannot build path to ${to}. Nobody knows why.`);
    }

    /**
     * @param to
     * @param params
     * @param query
     */
    navigate(to = null, params = {}, query = {}, options = {}) {
        const parts = this.buildPath(to, params, query, options).split("?");

        this._history.push(parts[0], parts.length > 1 ? parts[1] : "");
    }

    /**
     * @param pathname
     * @param search
     * @private
     */
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
                routeMatch.getRoutes().forEach(item => stack.add(item.getMiddleware()));
            }
        });

        // 404 not found
        if (!routeMatch) {
            this._eventEmitter.dispatch(Router.NOT_FOUND_EVENT, { path: pathname, query });
            return;
        }

        this._stateAdapter.update(routeMatch.getName(), routeMatch.getParams(), query);

        // Here we run the midlewares then the handlers
        stack.run({}, {}).then(() => this._eventEmitter.dispatch(Router.MATCHED_EVENT, routeMatch));
    }
}

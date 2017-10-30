import NamedRoutes from "named-routes";
import trim from "lodash.trim";
import { ParamsParser } from "./ParamsParser";
import { Stack } from "@stejar/promise-middleware";

export class Router {
    /**
     * @param history
     */
    constructor(history, alreadyInitialized = false) {
        // this.stopDispatch = false;
        this.serviceManager = undefined;
        this.alreadyInitialized = alreadyInitialized;
        this.started = false;
        this.unlisten = () => null;
        this.history = history;
        this.routes = [];
        this.namedRoutes = new NamedRoutes();
        this.paramsParser = new ParamsParser();
        this.dispachQueue = [];
        this.previousMiddlewares = [];
        this.options = {};

        this.previousRoute = null;
        this.previousRouteName = null;
        this.previousParams = null;
        this.previousQuery = null;

        this.currentRoute = null;
        this.currentRouteName = null;
        this.currentParams = null;
        this.currentQuery = null;

        this.matchedRoute = null;
        this.matchedRouteName = null;
        this.matchedParams = {};
        this.matchedQuery = {};

        this.listeners = [];
    }

    /**
     * @returns {*}
     */
    getOptions() {
        return this.options;
    }

    /**
     * @param options
     * @returns {Router}
     */
    setOptions(options) {
        this.options = { ...options };

        return this;
    }

    /**
     * @param serviceManager
     * @returns {Router}
     */
    setServiceManager(serviceManager) {
        this.serviceManager = serviceManager;
        this.serviceManager.set(Router, this);

        return this;
    }

    /**
     * @param routesSpec
     * @param parent
     * @returns {Router}
     */
    add(routesSpec, parent = null) {
        this._ensureArray(routesSpec).forEach(routeSpec => {
            routeSpec.parent = parent;
            this._ensureArray(routeSpec.children).forEach(child => this.add(child, routeSpec));

            this.routes.push(routeSpec);

            if (routeSpec.path) {
                this._generateNamedRoute(routeSpec, parent);
            }
        });

        return this;
    }

    // start(done, runOnEnterFirstTime = true) {
    start(onDone = () => null) {
        // 0. Do not restart if alredy started.
        if (this.started) {
            return;
        }

        this.started = true;

        this.unlisten = this.history.listen(location =>
            this._dispatch(location.pathname, location.search, () => null, false)
        );

        try {
            this._dispatch(
                this.history.location.pathname,
                this.history.location.search,
                onDone,
                this.alreadyInitialized
            );
        } catch (error) {
            onDone({ error });
        }
    }

    /**
     * @param url
     * @param search
     * @param onDone
     * @param wasInitialized
     * @private
     */
    _dispatch(url, search, onDone, wasInitialized) {
        if (this.currentRoute) {
            this.previousRoute = this.currentRoute;
        }
        if (this.currentRouteName) {
            this.previousRouteName = this.currentRouteName;
        }
        if (this.currentParams) {
            this.previousParams = this.currentParams;
        }
        if (this.currentQuery) {
            this.previousQuery = this.currentQuery;
        }

        const ID = Date.now();
        this.dispachQueue.push(ID);

        let isNotFound = false;

        // 1. Dispatch the request to the router
        // console.log(ID, "1. Dispatch the request to the router", url);
        this.namedRoutes.dispatch(
            {
                method: "get",
                path: url,
                search: search,
            },
            {},
            () => (isNotFound = true)
        );

        // console.log(ID, "2. Check if NOT FOUND");
        // 2. Handle NOT FOUND
        if (isNotFound) {
            // console.log(ID, " == STOP == NOT FOUND ==");

            this.routes.forEach(child => {
                // x. Index Route here check
                if (child.notFound === true) {
                    this.currentRouteName = this._generateRouteName(child);
                    this.currentRoute = child;
                }
            });

            if (!this.currentRoute) {
                onDone({
                    notFound: true,
                });
                return;
            }
        }

        // 3. Index(es) process
        // console.log(ID, "3. Index process");
        this._ensureArray(this.currentRoute.children).forEach(child => {
            // x. Index Route here check
            if (child.index === true) {
                this.currentRouteName = this._generateRouteName(child);
                this.currentRoute = child;
            }
        });

        // 5. Handle a Redirect Route
        const handleRedirect = () => {
            if (!this.currentRoute.redirect) {
                return;
            }

            // console.log(ID, "5. Handle a Redirect Route");

            if (this.currentRoute.toPath) {
                return this.redirect(this.currentRoute.toPath);
            }

            if (this.currentRoute.toName) {
                return this.redirect(
                    this.currentRoute.toName,
                    this.currentRoute.toParams || {},
                    this.currentRoute.toQuery || {},
                    {
                        keepOldParams: this.currentRoute.keepOldParams,
                        keepOldQuery: this.currentRoute.keepOldQuery,
                    }
                );
            }

            throw new Error("Invalid redirection");
        };

        // 6. Setup the route matched
        const matchRoute = () => {
            // console.log(ID, "6. Setup the route matched");
            this.matchedRouteName = this.currentRouteName;
            this.matchedRoute = this.currentRoute;
            this.matchedParams = this.currentParams;
            this.matchedQuery = this.currentQuery;
        };

        // 7. Run the event listenrs to render
        const runListeners = () => {
            // console.log(ID, "7. Run the event listenrs to render");
            this.listeners.forEach(listener => listener());
        };

        // 8. Finish
        const finish = () => {
            // console.log(ID, "-- Finish");
            this.dispachQueue = this.dispachQueue.splice(this.dispachQueue.indexOf(ID), 1);

            if (isNotFound) {
                onDone({
                    notFound: true,
                });

                return;
            }

            onDone({});
        };

        // 4. Handle middleware
        if (!wasInitialized) {
            const checkDispatch = () => {
                if (this.dispachQueue.indexOf(ID) === -1) {
                    // console.log(ID, "Stopping dispatch ...");
                    throw "Stop dispatch";
                }
            };

            const next = (from, to, next) => {
                return Promise.resolve()
                    .then(handleRedirect)
                    .then(checkDispatch)
                    .then(matchRoute)
                    .then(runListeners)
                    .then(next)
                    .catch(error => {
                        if (error === "Stop dispatch") {
                            return;
                        }

                        // console.log(error);

                        onDone({
                            error,
                        });
                    });
            };

            // console.log(ID, "4. Handle middleware");
            this._buildMiddlewareFuncs(this.currentRoute, next).then(finish);
        } else {
            this._buildMiddlewareFuncs(this.currentRoute, null, false);
            handleRedirect();

            if (this.dispachQueue.indexOf(ID) === -1) {
                return;
            }
            matchRoute();
            runListeners();
            finish();
        }
    }

    /**
     * @param listener
     * @returns {function()}
     */
    subscribe(listener) {
        if (typeof listener !== "function") {
            throw new Error("Expected listener to be a function.");
        }

        let isSubscribed = true;
        this.listeners.push(listener);

        return () => {
            if (!isSubscribed) {
                return;
            }

            isSubscribed = false;

            const index = this.listeners.indexOf(listener);
            this.listeners.splice(index, 1);
        };
    }

    /**
     * @param name
     * @param params
     * @param query
     * @param options
     * @returns {*}
     */
    generatePathFromName(name, params = {}, query = {}, options = {}) {
        if (!name) {
            let parent = this.currentRoute;
            let parts = [];
            while (parent) {
                if (parent.name) {
                    parts.push(parent.name);
                }
                if (parent.parent) {
                    parent = parent.parent;
                } else {
                    parent = null;
                }
            }
            name = parts.reverse().join(".");
        }

        if (name.indexOf("//") !== -1) {
            return name;
        }

        let keepOldParams = true;
        if (options.keepOldParams !== undefined) {
            keepOldParams = options.keepOldParams;
        }

        let keepOldQuery = false;
        if (options.keepOldQuery !== undefined) {
            keepOldQuery = options.keepOldQuery;
        }

        let path =
            this.namedRoutes.build(
                name,
                this.paramsParser.buildParams(keepOldParams ? this.currentParams : {}, params || {})
            ) + this.paramsParser.buildQueryString(keepOldQuery ? this.currentQuery : {}, query || {});

        return path;
    }

    /**
     * @param name
     * @param params
     * @param query
     * @param options
     */
    redirect(name, params = {}, query = {}, options = {}) {
        // if (this.currentRouteName === name) {
        //     // TODO: Should also check params and query. If same then return.
        //     return;
        // }

        let path = this.generatePathFromName(name, params, query, options);
        // console.log("Redirecting to ", path);
        this.dispachQueue.pop();
        this.history.push(path);
    }

    /**
     * @returns {*}
     */
    getMatchedRoute() {
        return this.matchedRoute;
    }

    /**
     * @returns {*}
     */
    getMatchedRouteName() {
        return this.matchedRouteName;
    }

    /**
     * @returns {*}
     */
    getMatchedParams() {
        return this.matchedParams;
    }

    /**
     * @returns {*}
     */
    getMatchedQuery() {
        return this.matchedQuery;
    }

    /**
     * @param data
     * @returns {*}
     * @private
     */
    _ensureArray(data) {
        if (!data) {
            return [];
        }

        if (!Array.isArray(data)) {
            return [data];
        }

        return data;
    }

    /**
     * @param spec
     * @private
     */
    _generateNamedRoute(spec, parentSpec) {
        let name = trim(spec.name, ".") || "";
        let path = trim(spec.path, "/");
        let parent = parentSpec;

        while (parent) {
            if (parent.name) {
                name = trim(parent.name, ".") + "." + name;
            }

            if (parent.path) {
                path = trim(parent.path, "/") + "/" + trim(path, "/");
            }

            parent = parent.parent || null;
        }

        this.namedRoutes.add(
            "get",
            "/" + trim(path, "/"),
            data => {
                this.currentRoute = spec;
                this.currentRouteName = this._generateRouteName(spec);
                this.currentParams = this.paramsParser.parseMatchedParams(data.params);
                this.currentQuery = this.paramsParser.parseQuery(data.search);
            },
            {
                name,
            }
        );
    }

    _buildMiddlewareFuncs(route, lastMiddleware = (from, to, next) => next(), shouldRun = true) {
        const stack = new Stack();
        let queue = [];

        let funcs = [];
        let parent = route;

        while (parent) {
            funcs.push(parent);

            if (parent.eventsHandler) {
                if (!this.serviceManager) {
                    throw new Error("A ServiceManager is required if using a route eventsHandler");
                }

                const handler = this.serviceManager.get(parent.eventsHandler);

                if (handler.onEnter) {
                    if (this.previousMiddlewares.indexOf(parent) === -1) {
                        queue.push((from, to, next) => handler.onEnter(to, next));
                    }
                }

                if (handler.onChange) {
                    if (this.previousMiddlewares.indexOf(parent) !== -1) {
                        queue.push((from, to, next) => handler.onChange(from, to, next));
                    }
                }
            }

            if (parent.onEnter) {
                if (this.previousMiddlewares.indexOf(parent) === -1) {
                    queue.push(
                        (function(onEnter, router) {
                            return (from, to, next) => onEnter(to, next, router, router.getOptions());
                        })(parent.onEnter, this)
                    );
                }
            }
            if (parent.onChange) {
                if (this.previousMiddlewares.indexOf(parent) !== -1) {
                    queue.push(
                        (function(onChange, router) {
                            return (from, to, next) => onChange(from, to, next, router, router.getOptions());
                        })(parent.onChange, this)
                    );
                }
            }

            if (parent.parent) {
                parent = parent.parent;
            } else {
                parent = null;
            }
        }

        this.previousMiddlewares = funcs;

        if (!shouldRun) {
            return;
        }

        queue.reverse().forEach(item => stack.add(item));

        return stack.add(lastMiddleware).run(
            {
                name: this.previousRouteName,
                route: this.previousRoute,
                params: this.previousParams,
                query: this.previousQuery,
            },
            {
                name: this.currentRouteName,
                route: this.currentRoute,
                params: this.currentParams,
                query: this.currentQuery,
            }
        );
    }

    /**
     * @param route
     * @param previousName
     * @returns {*}
     * @private
     */
    _generateRouteName(route, previousName = "") {
        let name = previousName;

        if (route.name) {
            if (name) {
                name = route.name + "." + name;
            } else {
                name = route.name;
            }
        }

        if (route.parent) {
            return this._generateRouteName(route.parent, name);
        }

        return name;
    }
}

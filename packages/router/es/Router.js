import _slicedToArray from "babel-runtime/helpers/slicedToArray";
import _Promise from "babel-runtime/core-js/promise";
import _extends from "babel-runtime/helpers/extends";
import _classCallCheck from "babel-runtime/helpers/classCallCheck";
import _createClass from "babel-runtime/helpers/createClass";
import NamedRoutes from "named-routes";
import trim from "lodash.trim";
import { ParamsParser } from "./ParamsParser";

export var Router = function () {
    /**
     * @param history
     */
    function Router(history) {
        _classCallCheck(this, Router);

        // this.stopDispatch = false;
        this.started = false;
        this.unlisten = function () {
            return null;
        };
        this.history = history;
        this.routes = [];
        this.namedRoutes = new NamedRoutes();
        this.paramsParser = new ParamsParser();
        this.dispachQueue = [];
        this.previousMiddlewares = [];
        this.options = {};

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


    _createClass(Router, [{
        key: "getOptions",
        value: function getOptions() {
            return this.options;
        }

        /**
         * @param options
         * @returns {Router}
         */

    }, {
        key: "setOptions",
        value: function setOptions(options) {
            this.options = _extends({}, options);

            return this;
        }

        /**
         * @param routesSpec
         * @param parent
         * @returns {Router}
         */

    }, {
        key: "add",
        value: function add(routesSpec) {
            var _this = this;

            var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

            this._ensureArray(routesSpec).forEach(function (routeSpec) {
                routeSpec.parent = parent;
                _this._ensureArray(routeSpec.children).forEach(function (child) {
                    return _this.add(child, routeSpec);
                });

                _this.routes.push(routeSpec);

                if (routeSpec.path) {
                    _this._generateNamedRoute(routeSpec, parent);
                }
            });

            return this;
        }

        // start(done, runOnEnterFirstTime = true) {

    }, {
        key: "start",
        value: function start() {
            var _this2 = this;

            var onDone = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {
                return null;
            };
            var wasInitialized = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


            // 0. Do not restart if alredy started.
            if (this.started) {
                return;
            }

            this.started = true;

            this.unlisten = this.history.listen(function (location) {
                return _this2._dispatch(location.pathname, location.search, function () {
                    return null;
                }, false);
            });

            this._dispatch(this.history.location.pathname, this.history.location.search, onDone, wasInitialized);
        }

        /**
         * @param url
         * @param search
         * @param onDone
         * @param wasInitialized
         * @private
         */

    }, {
        key: "_dispatch",
        value: function _dispatch(url, search, onDone, wasInitialized) {
            var _this3 = this;

            var ID = Date.now();
            this.dispachQueue.push(ID);

            var isNotFound = false;

            // 1. Dispatch the request to the router
            console.log(ID, "1. Dispatch the request to the router", url);
            this.namedRoutes.dispatch({
                method: "get",
                path: url,
                search: search
            }, {}, function () {
                return isNotFound = true;
            });

            console.log(ID, "2. Check if NOT FOUND");
            // 2. Handle NOT FOUND
            if (isNotFound) {
                console.log(ID, " == STOP == NOT FOUND ==");

                this.routes.forEach(function (child) {
                    // x. Index Route here check
                    if (child.notFound === true) {
                        _this3.currentRouteName = child.name;
                        _this3.currentRoute = child;
                    }
                });

                if (!this.currentRoute) {
                    onDone({
                        notFound: true
                    });
                    return;
                }
            }

            // 3. Index(es) process
            console.log(ID, "3. Index process");
            this._ensureArray(this.currentRoute.children).forEach(function (child) {
                // x. Index Route here check
                if (child.index === true) {
                    _this3.currentRouteName = child.name || _this3.currentRoute.name;
                    _this3.currentRoute = child;
                }
            });

            // 5. Handle a Redirect Route
            var handleRedirect = function handleRedirect() {
                if (!_this3.currentRoute.redirect) {
                    return;
                }

                console.log(ID, "5. Handle a Redirect Route");

                if (_this3.currentRoute.toPath) {
                    return _this3.redirect(_this3.currentRoute.toPath);
                }

                if (_this3.currentRoute.toName) {
                    return _this3.redirect(_this3.currentRoute.toName, _this3.currentRoute.toParams || {}, _this3.currentRoute.toQuery || {}, {
                        keepOldParams: _this3.currentRoute.keepOldParams,
                        keepOldQuery: _this3.currentRoute.keepOldQuery
                    });
                }

                throw new Error("Invalid redirection");
            };

            // 6. Setup the route matched
            var matchRoute = function matchRoute() {
                console.log(ID, "6. Setup the route matched");
                _this3.matchedRouteName = _this3.currentRouteName;
                _this3.matchedRoute = _this3.currentRoute;
                _this3.matchedParams = _this3.currentParams;
                _this3.matchedQuery = _this3.currentQuery;
            };

            // 7. Run the event listenrs to render
            var runListeners = function runListeners() {
                console.log(ID, "7. Run the event listenrs to render");
                _this3.listeners.forEach(function (listener) {
                    return listener();
                });
            };

            // 8. Finish
            var finish = function finish() {
                console.log(ID, "-- Finish");
                _this3.dispachQueue = _this3.dispachQueue.splice(_this3.dispachQueue.indexOf(ID), 1);

                if (isNotFound) {
                    onDone({
                        notFound: true
                    });

                    return;
                }

                onDone({});
            };

            // 4. Handle middleware
            if (!wasInitialized) {
                var checkDispatch = function checkDispatch() {
                    if (_this3.dispachQueue.indexOf(ID) === -1) {
                        console.log(ID, "Stopping dispatch ...");
                        return _Promise.reject("Stop dispatch");
                    }
                };

                console.log(ID, "4. Handle middleware");
                _Promise.resolve().then(function () {
                    return _this3._processMiddlewares(_this3.currentRoute);
                }).then(handleRedirect).then(checkDispatch).then(matchRoute).then(runListeners).then(finish).catch(function (err) {
                    if (err === "Stop dispatch") {
                        return;
                    }

                    throw err;
                });
            } else {
                var _buildMiddlewareFuncs2 = this._buildMiddlewareFuncs(this.currentRoute),
                    _buildMiddlewareFuncs3 = _slicedToArray(_buildMiddlewareFuncs2, 1),
                    funcs = _buildMiddlewareFuncs3[0];

                this.previousMiddlewares = funcs;

                handleRedirect();
                //
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

    }, {
        key: "subscribe",
        value: function subscribe(listener) {
            var _this4 = this;

            if (typeof listener !== "function") {
                throw new Error("Expected listener to be a function.");
            }

            var isSubscribed = true;
            this.listeners.push(listener);

            return function () {
                if (!isSubscribed) {
                    return;
                }

                isSubscribed = false;

                var index = _this4.listeners.indexOf(listener);
                _this4.listeners.splice(index, 1);
            };
        }

        /**
         * @param name
         * @param params
         * @param query
         * @param options
         * @returns {*}
         */

    }, {
        key: "generatePathFromName",
        value: function generatePathFromName(name) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var query = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
            var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

            if (!name) {
                var parent = this.currentRoute;
                var parts = [];
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

            var keepOldParams = true;
            if (options.keepOldParams !== undefined) {
                keepOldParams = options.keepOldParams;
            }

            var keepOldQuery = false;
            if (options.keepOldQuery !== undefined) {
                keepOldQuery = options.keepOldQuery;
            }

            var path = this.namedRoutes.build(name, this.paramsParser.buildParams(keepOldParams ? this.currentParams : {}, params || {})) + this.paramsParser.buildQueryString(keepOldQuery ? this.currentQuery : {}, query || {});

            return path;
        }

        /**
         * @param name
         * @param params
         * @param query
         * @param options
         */

    }, {
        key: "redirect",
        value: function redirect(name) {
            var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            var query = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
            var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

            // if (this.currentRouteName === name) {
            //     // TODO: Should also check params and query. If same then return.
            //     return;
            // }

            var path = this.generatePathFromName(name, params, query, options);
            console.log("Redirecting to ", path);
            this.dispachQueue.pop();
            this.history.push(path);
        }

        /**
         * @returns {*}
         */

    }, {
        key: "getMatchedRoute",
        value: function getMatchedRoute() {
            return this.matchedRoute;
        }

        /**
         * @returns {*}
         */

    }, {
        key: "getMatchedRouteName",
        value: function getMatchedRouteName() {
            return this.matchedRouteName;
        }

        /**
         * @returns {*}
         */

    }, {
        key: "getMatchedParams",
        value: function getMatchedParams() {
            return this.matchedParams;
        }

        /**
         * @returns {*}
         */

    }, {
        key: "getMatchedQuery",
        value: function getMatchedQuery() {
            return this.matchedQuery;
        }

        /**
         * @param data
         * @returns {*}
         * @private
         */

    }, {
        key: "_ensureArray",
        value: function _ensureArray(data) {
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

    }, {
        key: "_generateNamedRoute",
        value: function _generateNamedRoute(spec, parentSpec) {
            var _this5 = this;

            var name = trim(spec.name, ".") || "";
            var path = trim(spec.path, "/");
            var parent = parentSpec;

            while (parent) {
                if (parent.name) {
                    name = trim(parent.name, ".") + "." + name;
                }

                if (parent.path) {
                    path = trim(parent.path, "/") + "/" + trim(path, "/");
                }

                parent = parent.parent || null;
            }

            this.namedRoutes.add("get", "/" + trim(path, "/"), function (data) {
                _this5.currentRoute = spec;
                _this5.currentRouteName = name;
                _this5.currentParams = _this5.paramsParser.parseMatchedParams(data.params);
                _this5.currentQuery = _this5.paramsParser.parseQuery(data.search);
            }, {
                name: name
            });
        }
    }, {
        key: "_buildMiddlewareFuncs",
        value: function _buildMiddlewareFuncs(route) {
            var funcs = [];
            var middlewares = [];
            var parent = route;

            while (parent) {
                if (parent.onEnter) {
                    if (this.previousMiddlewares.indexOf(parent) === -1) {
                        funcs.push(parent);
                        middlewares.push(parent.onEnter.bind(null, this, this.currentParams, this.currentQuery, this.getOptions()));
                    }
                }
                if (parent.onChange) {
                    if (this.previousMiddlewares.indexOf(parent) !== -1) {
                        funcs.push(parent);
                        middlewares.push(parent.onChange.bind(null, this, this.currentParams, this.currentQuery, this.getOptions()));
                    }
                }

                if (parent.parent) {
                    parent = parent.parent;
                } else {
                    parent = null;
                }
            }

            middlewares = middlewares.reverse();

            return [funcs, middlewares];
        }

        /**
         * @param route
         * @param next
         * @returns {Promise.<TResult>}
         * @private
         */

    }, {
        key: "_processMiddlewares",
        value: function _processMiddlewares(route) {
            var _this6 = this;

            var _buildMiddlewareFuncs4 = this._buildMiddlewareFuncs(route),
                _buildMiddlewareFuncs5 = _slicedToArray(_buildMiddlewareFuncs4, 2),
                funcs = _buildMiddlewareFuncs5[0],
                middlewares = _buildMiddlewareFuncs5[1];

            return this._convertArrayOfPromisesToChaing(middlewares).then(function () {
                return _this6.previousMiddlewares = funcs;
            });
        }

        /**
         * @param promises
         * @returns {*}
         * @private
         */

    }, {
        key: "_convertArrayOfPromisesToChaing",
        value: function _convertArrayOfPromisesToChaing(promises) {
            return promises.reduce(function (prev, cur) {
                return prev.then(cur);
            }, _Promise.resolve());
        }
    }]);

    return Router;
}();
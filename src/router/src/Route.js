import RouteParser from "url-pattern";
import { RouteMatch } from "./RouteMatch";

export class Route {
    static MATCH_STANDARD = "standard";
    static MATCH_EXACT = "exact";

    static TYPE_NORMAL = "normal";
    static TYPE_REDIRECT = "redirect";

    /**
     * @param options
     */
    constructor(options) {
        this._name       = options.name || null;
        this._matchType  = options.match || Route.MATCH_STANDARD;
        this._path       = options.path || null;
        this._component  = options.component || (() => null);
        this._middleware = options.middleware || (() => Promise.resolve());
        this._children   = [];
        this._parent     = options.parent || null;
    }

    /**
     * @param children
     */
    attachChildren(children) {
        this._children = children;
    }

    /**
     * @param params
     * @param query
     * @returns {*}
     */
    getPath(params, query) {
        if (typeof this._path !== "function") {
            return this._path;
        }

        return this._path(params, query);
    }

    /**
     * @returns {null|*}
     */
    getName() {
        return this._name;
    }

    /**
     * @returns {string}
     */
    getMatchType() {
        return this._matchType;
    }

    /**
     * @returns {*|null}
     */
    getMiddleware() {
        return this._middleware;
    }

    /**
     * @returns {*}
     */
    getComponent() {
        return this._component;
    }

    /**
     * @param pathParts
     * @param routeParams
     * @param routeQuery
     * @returns {*}
     */
    match(pathParts, routeParams, routeQuery) {
        let matchedRoutes = [];

        let path = "";
        for (let offset in pathParts) {
            // Accumulate the path on each iteration until a match happens
            path += path ? "/" + pathParts[offset] : pathParts[offset];

            let routePath;
            // try {
            routePath = this.getPath(routeParams, routeQuery);
            if (!routePath) {
                continue;
            }
            // } catch (error) {
            //     // TODO: is this smart?
            //     continue;
            // }

            let parser = this._generateParser(routePath);
            // console.log("Matching " + this.getPath(routeParams, routeQuery) + " to " + path);
            const result = parser.match(path);

            if (!result) {
                continue;
            }

            // console.log("Matched with params ", result);
            matchedRoutes.push(this);

            // Filter out real children for "EXACT" matches
            let exactMatchChild = this._extractExactMatch(this._children);
            let children = this._children.filter(item => (exactMatchChild ? item !== exactMatchChild : true));

            // But also include the EXACT matches childrens
            // so that we can do /tasks/delete/:id vs /tasks/edit/:id
            // where one renders outside of "tasks" and one renders inside of "tasks"
            if (exactMatchChild && exactMatchChild._children) {
                children = children.concat(exactMatchChild._children);
            }

            // Jump to next part of the path
            let childParts = pathParts.slice(offset + 1);

            // But if there is no more parts to the path
            if (childParts.length === 0) {
                // It means the current route must be displayed.
                // However, if we have an EXACT match which we need to display
                if (exactMatchChild) {
                    return new RouteMatch(result, routeQuery, matchedRoutes.slice(0).concat(exactMatchChild));
                }

                return new RouteMatch(result, routeQuery, matchedRoutes);
            }

            // Loop children and match each until a result happens
            for (let childOffset in children) {
                let child = children[childOffset];

                let routeMatch = child.match(childParts, { ...routeParams, ...result }, routeQuery);

                if (!routeMatch) {
                    continue;
                }

                if (exactMatchChild && exactMatchChild._children.includes(child)) {
                    // console.log("MATCHED FULLY");
                    // console.info("MATCHED WHILE INSIDE EXACT");

                    return new RouteMatch(
                        { ...result, ...routeMatch.getParams() },
                        routeQuery,
                        matchedRoutes
                            .slice(0)
                            .concat(exactMatchChild)
                            .concat(routeMatch.getRoutes())
                    );
                }

                // console.log("MATCHED FULLY");
                return new RouteMatch(
                    { ...result, ...routeMatch.getParams() },
                    routeQuery,
                    matchedRoutes.slice(0).concat(routeMatch.getRoutes())
                );
            }
        }

        return false;
    }

    /**
     * @param parts
     * @param params
     * @param query
     * @returns {string|boolean}
     */
    reverse(parts, params, query) {
        let currentPart = parts.slice(0).shift();
        if (this.getName() !== currentPart) {
            return false;
        }

        let path = this.getPath(params, query);
        if (path) {
            const parser = this._generateParser(path);
            path = parser.stringify(params);
        }

        if (parts.length == 1) {
            return path;
        }

        for (let offset in this._children) {
            const child = this._children[offset];
            const result = child.reverse(parts.slice(1, parts.length), params, query);

            if (!result) {
                continue;
            }

            return (path === "/" ? path : path + "/") + result;
        }

        return false;
    }

    /**
     * @param params
     * @param segment
     * @returns {*}
     * @private
     */
    _generateParser(path, segment = "a-zA-Z0-9_-") {
        return new RouteParser(path, { segmentNameCharset: segment });
    }

    /**
     * @param children
     * @returns {*}
     * @private
     */
    _extractExactMatch(children) {
        const results = children.filter(item => item.getMatchType() === Route.MATCH_EXACT);
        if (results.length > 1) {
            throw new Error("A route cannot have more than 1 exact match");
        }

        if (results.length === 0) {
            return null;
        }

        return results[0];
    }
}

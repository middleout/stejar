import invariant from "invariant";
import RouteParser from "url-pattern";
import { RouteMatch } from "./RouteMatch";

export class Route {
    static MATCH_STANDARD = "standard";
    static MATCH_EXACT = "exact";

    static TYPE_NORMAL = "normal";
    static TYPE_REDIRECT = "redirect";

    constructor(options) {
        this._name = options.name || null;
        this._matchType = options.match || Route.MATCH_STANDARD;
        this._type = options.type || Route.TYPE_NORMAL;
        this._path = options.path || null;
        this._component = options.component || null;
        this._middleware = options.middleware || null;
        this._serviceManager = options.serviceManager || null;
        this._options = options.options || {};
        this._children = [];
    }

    getType() {
        return this._type;
    }

    getOptions() {
        return this._options;
    }

    attachChildren(children) {
        this._children = children;
    }

    getPath(params, query) {
        if (typeof this._path !== "function") {
            return this._path;
        }

        if (!this._serviceManager) {
            if (this._path) {
                return this._path(params, query);
            }

            return;
        }

        let path;
        try {
            if (this._path) {
                path = this._serviceManager.get(this._path);
            }
        } catch (err) {
            // do not do anything. It simply means that we cannot fetch an instance
            // from the SM for this Path Class
        }

        if (path) {
            if (path.generate) {
                return path.generate(params, query);
            }
            return path(params, query);
        }
    }

    getName() {
        return this._name;
    }

    getMatchType() {
        return this._matchType;
    }

    getComponent() {
        return this._component;
    }

    getMiddleware() {
        return this._middleware;
    }

    match(pathParts, routeParams, routeQuery) {
        let matchedRoutes = [];

        let path = "";
        for (let offset in pathParts) {
            // Accumulate the path on each iteration until a match happens
            path += path ? "/" + pathParts[offset] : pathParts[offset];

            let routePath;
            routePath = this.getPath(routeParams, routeQuery);
            if (!routePath) {
                continue;
            }

            let parser = this._generateParser(routePath);
            const result = parser.match(path);

            if (!result) {
                continue;
            }

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
                // However, if we have an EXACT match, we need to display that also
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
                    return new RouteMatch(
                        { ...result, ...routeMatch.getParams() },
                        routeQuery,
                        matchedRoutes
                            .slice(0)
                            .concat(exactMatchChild)
                            .concat(routeMatch.getRoutes())
                    );
                }

                return new RouteMatch(
                    { ...result, ...routeMatch.getParams() },
                    routeQuery,
                    matchedRoutes.slice(0).concat(routeMatch.getRoutes())
                );
            }
        }

        return false;
    }

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

        if (parts.length === 1) {
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

    _generateParser(path, segment = "a-zA-Z0-9_-") {
        return new RouteParser(path, { segmentNameCharset: segment });
    }

    _extractExactMatch(children) {
        const results = children.filter(item => item.getMatchType() === Route.MATCH_EXACT);
        invariant(
            results.length <= 1,
            process.env.NODE_ENV === "production"
                ? undefined
                : `A route cannot have more than 1 children with the match set to "Route.MATCH_EXACT".`
        );

        if (results.length === 0) {
            return null;
        }

        return results[0];
    }
}

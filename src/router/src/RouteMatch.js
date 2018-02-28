export class RouteMatch {
    /**
     * @param params
     * @param query
     * @param routes
     */
    constructor(params, query, routes) {
        this._params = params;
        this._routes = routes;
        this._query = query;
        this._name = routes
            .map(item => item.getName())
            .filter(item => !!item)
            .join(".");
    }

    /**
     * @returns {*}
     */
    getParams() {
        return this._params;
    }

    /**
     * @returns {*}
     */
    getRoutes() {
        return this._routes;
    }

    /**
     * @returns {*}
     */
    getQuery() {
        return this._query;
    }

    /**
     * @returns {*}
     */
    getName() {
        return this._name;
    }
}

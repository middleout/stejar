export class RouteMatch {
    constructor(params, query, routes) {
        this._params = params;
        this._routes = routes;
        this._query = query;
        this._name = routes
            .map(item => item.getName())
            .filter(item => !!item)
            .join(".");
    }

    getParams() {
        return this._params;
    }

    getRoutes() {
        return this._routes;
    }

    getQuery() {
        return this._query;
    }

    getName() {
        return this._name;
    }
}

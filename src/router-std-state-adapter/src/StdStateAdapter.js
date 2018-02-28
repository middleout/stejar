export class StdStateAdapter {
    /**
     * Constructor
     */
    constructor() {
        this._previous = null;
        this._current = null;
    }

    /**
     * @returns {*}
     */
    getCurrentParams() {
        return this._current.params;
    }

    /**
     * @returns {*}
     */
    getPreviousParams() {
        return this._previous.params;
    }

    /**
     * @returns {*}
     */
    getCurrentQuery() {
        return this._current.query;
    }

    /**
     * @returns {*}
     */
    getPreviousQuery() {
        return this._previous.query;
    }

    /**
     * @returns {*}
     */
    getCurrentRouteName() {
        return this._current.routeName;
    }

    /**
     * @returns {*}
     */
    getPreviousRouteName() {
        return this._previous.routeName;
    }

    /**
     * @param routeName
     * @param params
     * @param query
     */
    update(routeName, params, query) {
        if (this._current) {
            this._previous = { ...this._current };
        }

        this._current = {
            routeName,
            params,
            query,
        };
    }

    /**
     * @returns {boolean}
     */
    hasCurrentRoute() {
        return !!this._current;
    }
}

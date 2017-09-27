export const Method = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
    PATCH: "PATCH",
    OPTIONS: "OPTIONS",
};

export class HttpRequest {
    /**
     * @type {string|null}
     * @private
     */
    _path = null;

    /**
     * @type {number}
     */
    _timeoutValue = 30000;

    /**
     * @type {string}
     */
    _method = Method.GET;

    /**
     * @type {{}}
     */
    _queryParams = {};

    /**
     * @type {{}}
     */
    _headerParams = {};

    /**
     * @type {Blob|FormData|string}
     * @private
     */
    _bodyParams = null;

    /**
     * @param path
     */
    constructor(path) {
        this._path = path;
    }

    /**
     * @returns {string}
     */
    getPath() {
        return this._path;
    }

    /**
     * @returns {string}
     */
    getMethod() {
        return this._method;
    }

    /**
     * @returns {number}
     */
    getTimeout() {
        return this._timeoutValue;
    }

    /**
     * @returns {Blob|FormData|string}
     */
    getBodyParams() {
        return this._bodyParams;
    }

    /**
     * @returns {Object}
     */
    getHeaderParams() {
        return this._headerParams;
    }

    /**
     * @returns {Object}
     */
    getQueryParams() {
        return this._queryParams;
    }

    /**
     * @param url
     * @returns {HttpRequest}
     */
    url(url) {
        const request = Object.assign(Object.create(this), this);
        request._path = url;
        return request;
    }

    /**
     * @param timeout
     * @returns {HttpRequest}
     */
    timeout(timeout) {
        const request = Object.assign(Object.create(this), this);
        request._timeoutValue = timeout;
        return request;
    }

    /**
     * @returns {HttpRequest}
     */
    post() {
        const request = Object.assign(Object.create(this), this);
        request._method = Method.POST;
        return request;
    }

    /**
     * @returns {HttpRequest}
     */
    get() {
        const request = Object.assign(Object.create(this), this);
        request._method = Method.GET;
        return request;
    }

    /**
     * @returns {HttpRequest}
     */
    patch() {
        const request = Object.assign(Object.create(this), this);
        request._method = Method.PATCH;
        return request;
    }

    /**
     * @returns {HttpRequest}
     */
    put() {
        const request = Object.assign(Object.create(this), this);
        request._method = Method.PUT;
        return request;
    }

    /**
     * @returns {HttpRequest}
     */
    delete() {
        const request = Object.assign(Object.create(this), this);
        request._method = Method.DELETE;
        return request;
    }

    /**
     * @returns {HttpRequest}
     */
    options() {
        const request = Object.assign(Object.create(this), this);
        request._method = Method.OPTIONS;
        return request;
    }

    /**
     * @param key
     * @param value
     * @returns {HttpRequest}
     */
    query(key, value) {
        const request = Object.assign(Object.create(this), this);
        request._queryParams[key] = value;
        return request;
    }

    /**
     * @param key
     * @param value
     * @returns {HttpRequest}
     */
    header(key, value) {
        const request = Object.assign(Object.create(this), this);
        request._headerParams[key] = value;
        return request;
    }

    /**
     * @returns {HttpRequest}
     */
    jsonHeaders() {
        return this.header("Content-Type", "application/json");
    }

    /**
     * @param value
     * @returns {HttpRequest}
     */
    body(value) {
        const request = Object.assign(Object.create(this), this);
        request._bodyParams = value;
        return request;
    }
}

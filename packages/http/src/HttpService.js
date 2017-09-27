import { HttpResponse } from "./HttpResponse";

export class HttpService {
    /**
     * @type {*}
     * @private
     */
    _adapter = null;

    /**
     * @type {{}}
     * @private
     */
    _requestsInProgress = {};

    /**
     * @type {Array}
     * @private
     */
    _requestInterceptors = [];

    /**
     * @type {Array}
     * @private
     */
    _responseInterceptors = [];

    /**
     * @type {Array}
     * @private
     */
    _responseErrorInterceptors = [];

    /**
     * @param adapter
     */
    constructor(adapter) {
        this._adapter = adapter;
    }

    /**
     * @param interceptor
     * @returns {Function}
     */
    addRequestInterceptor(interceptor) {
        this._requestInterceptors.push(interceptor);
        return () => {
            const $index = this._requestInterceptors.indexOf(interceptor);
            this._requestInterceptors.splice($index, 1);
        };
    }

    /**
     * @param interceptor
     * @returns {Function}
     */
    addResponseInterceptor(interceptor) {
        this._responseInterceptors.push(interceptor);
        return () => {
            const $index = this._responseInterceptors.indexOf(interceptor);
            this._responseInterceptors.splice($index, 1);
        };
    }

    /**
     * @param interceptor
     * @returns {Function}
     */
    addResponseErrorInterceptor(interceptor) {
        this._responseErrorInterceptors.push(interceptor);
        return () => {
            const $index = this._responseErrorInterceptors.indexOf(interceptor);
            this._responseInterceptors.splice($index, 1);
        };
    }

    /**
     * @param request
     * @returns {Promise<T>}
     */
    send(request) {
        let promise = Promise.resolve(request);

        for (const interceptor of this._requestInterceptors) {
            promise = promise.then(interceptor);
        }

        const hashKeys = [];

        return promise
            .then(newRequest => {
                const hashKey = JSON.stringify(newRequest);
                if (this._requestsInProgress[hashKey]) {
                    return this._requestsInProgress[hashKey];
                }
                hashKeys.push(hashKey);

                if (newRequest instanceof HttpResponse) {
                    return newRequest;
                }

                this._requestsInProgress[hashKey] = this._adapter.send(newRequest);
                return this._requestsInProgress[hashKey];
            })
            .then(response => {
                hashKeys.forEach(hashKey => delete this._requestsInProgress[hashKey]);
                return response;
            })
            .then(response => {
                promise = Promise.resolve(response);
                for (const interceptor of this._responseInterceptors) {
                    promise = promise.then(interceptor);
                }

                return promise;
            })
            .catch(error => {
                hashKeys.forEach(hashKey => delete this._requestsInProgress[hashKey]);

                if (this._responseErrorInterceptors.length === 0) {
                    return Promise.reject(error);
                }

                promise = Promise.resolve(error);
                for (const interceptor of this._responseErrorInterceptors) {
                    promise = promise.then(interceptor).catch(newError => {
                        throw newError;
                    });
                }

                return promise;
            });
    }
}

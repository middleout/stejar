import { FetchAdapter } from "../Adapter/FetchAdapter";
import { HttpAdapterContract } from "../Contract/HttpAdapterContract";
import { RequestInterceptorContract, ResponseInterceptorContract } from "../Contract/InterceptorContract";
import { HttpRequest } from "./HttpRequest";
import { HttpResponse } from "./HttpResponse";

export class HttpService {
    /**
     * @type {{}}
     */
    protected requestsInProgress: { [key: string]: Promise<HttpResponse<any>> } = {};

    /**
     * @type {Array}
     */
    protected requestInterceptors: RequestInterceptorContract[] = [];

    /**
     * @type {Array}
     */
    protected responseInterceptors: ResponseInterceptorContract[] = [];

    /**
     * @type {Array}
     */
    protected responseErrorInterceptors: ResponseInterceptorContract[] = [];

    /**
     * @param adapter
     */
    constructor(protected adapter: HttpAdapterContract = new FetchAdapter()) {}

    /**
     * @param interceptor
     * @returns {Function}
     */
    addRequestInterceptor(interceptor: RequestInterceptorContract): () => void {
        this.requestInterceptors.push(interceptor);
        return () => {
            const $index = this.requestInterceptors.indexOf(interceptor);
            this.requestInterceptors.splice($index, 1);
        };
    }

    /**
     * @param interceptor
     * @returns {Function}
     */
    addResponseInterceptor(interceptor: ResponseInterceptorContract): () => void {
        this.responseInterceptors.push(interceptor);
        return () => {
            const $index = this.responseInterceptors.indexOf(interceptor);
            this.responseInterceptors.splice($index, 1);
        };
    }

    /**
     * @param interceptor
     * @returns {Function}
     */
    addResponseErrorInterceptor(interceptor: ResponseInterceptorContract): () => void {
        this.responseErrorInterceptors.push(interceptor);
        return () => {
            const $index = this.responseErrorInterceptors.indexOf(interceptor);
            this.responseInterceptors.splice($index, 1);
        };
    }

    /**
     * @param request
     * @returns {Promise<T>}
     */
    send<T>(request: HttpRequest): Promise<HttpResponse<T>> {
        let promise: Promise<any> = Promise.resolve(request);

        for (const interceptor of this.requestInterceptors) {
            promise = promise.then(interceptor as any);
        }

        const hashKeys: string[] = [];

        return promise
            .then((newRequest: any) => {
                const hashKey = JSON.stringify(newRequest);
                if (this.requestsInProgress[hashKey]) {
                    return this.requestsInProgress[hashKey];
                }
                hashKeys.push(hashKey);

                if (newRequest instanceof HttpResponse) {
                    return newRequest;
                }

                this.requestsInProgress[hashKey] = this.adapter.send<T>(newRequest);
                return this.requestsInProgress[hashKey];
            })
            .then(response => {
                hashKeys.forEach(hashKey => delete this.requestsInProgress[hashKey]);
                return response;
            })
            .then(response => {
                promise = Promise.resolve(response);
                for (const interceptor of this.responseInterceptors) {
                    promise = promise.then(interceptor);
                }

                return promise;
            })
            .catch(error => {
                hashKeys.forEach(hashKey => delete this.requestsInProgress[hashKey]);

                if (this.responseErrorInterceptors.length === 0) {
                    return Promise.reject(error);
                }

                promise = Promise.resolve(error);
                for (const interceptor of this.responseErrorInterceptors) {
                    promise = promise.then(interceptor).catch((newError: any) => {
                        throw newError;
                    });
                }

                return promise;
            });
    }
}

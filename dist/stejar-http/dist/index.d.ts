// Generated by dts-bundle v0.6.1

export interface HttpAdapterContract {
    /**
      * @param request
      */
    send<T>(request: HttpRequest): Promise<HttpResponse<T>>;
}

export interface RequestInterceptorContract {
    <R>(request: HttpRequest): Promise<HttpRequest> | Promise<HttpResponse<R>>;
}
export interface ResponseInterceptorContract {
    <T>(response: HttpResponse<T>): Promise<HttpResponse<T>>;
}

export class FetchAdapter implements HttpAdapterContract {
    /**
      * @param request
      * @returns {Promise<T>}
      */
    send<T>(request: HttpRequest): Promise<HttpResponse<T>>;
}

export class MocksAdapter implements HttpAdapterContract {
        /**
            * @type {{}}
            */
        protected mocks: {};
        /**
            * @param match
            * @param method
            * @param response
            */
        mock(match: any, method: string, response: (request: HttpRequest) => Promise<any>): void;
        /**
            * @param request
            * @returns {null}
            */
        send<T>(request: HttpRequest): Promise<HttpResponse<T>>;
}

export enum Method {
        GET,
        POST,
        PUT,
        DELETE,
        PATCH,
        OPTIONS,
}
export class HttpRequest {
        protected path: string;
        /**
            * @param path
            */
        constructor(path: string);
        /**
            * @type {number}
            */
        protected timeoutValue: number;
        /**
            * @type {Method}
            */
        protected method: Method;
        /**
            * @type {{}}
            */
        protected queryParams: Object;
        /**
            * @type {{}}
            */
        protected headerParams: Object;
        /**
            * @type {{}}
            */
        protected bodyParams: Blob | FormData | string;
        /**
            * @returns {string}
            */
        getPath(): string;
        /**
            * @returns {Method}
            */
        getMethod(): Method;
        /**
            * @returns {number}
            */
        getTimeout(): number;
        /**
            * @returns {Blob|FormData|string}
            */
        getBodyParams(): Blob | FormData | string;
        /**
            * @returns {Object}
            */
        getHeaderParams(): Object;
        /**
            * @returns {Object}
            */
        getQueryParams(): Object;
        /**
            * @param url
            * @returns {HttpRequest}
            */
        url(url: string): HttpRequest;
        /**
            * @param timeout
            * @returns {HttpRequest}
            */
        timeout(timeout: number): HttpRequest;
        /**
            * @returns {HttpRequest}
            */
        post(): HttpRequest;
        /**
            * @returns {HttpRequest}
            */
        get(): HttpRequest;
        /**
            * @returns {HttpRequest}
            */
        patch(): HttpRequest;
        /**
            * @returns {HttpRequest}
            */
        put(): HttpRequest;
        /**
            * @returns {HttpRequest}
            */
        delete(): HttpRequest;
        /**
            * @returns {HttpRequest}
            */
        options(): HttpRequest;
        /**
            * @param key
            * @param value
            * @returns {HttpRequest}
            */
        query(key: string, value: any | any[]): HttpRequest;
        /**
            * @param key
            * @param value
            * @returns {HttpRequest}
            */
        header(key: string, value: string): HttpRequest;
        /**
            * @returns {HttpRequest}
            */
        jsonHeaders(): HttpRequest;
        /**
            * @param value
            * @returns {HttpRequest}
            */
        body(value: Blob | FormData | string): HttpRequest;
}

export class HttpResponse<R> {
    statusCode: number;
    statusText: string;
    request: HttpRequest;
    data: R;
    headers: Object | Headers;
    /**
      * @param statusCode
      * @param statusText
      * @param request
      * @param data
      * @param headers
      */
    constructor(statusCode: number, statusText: string, request: HttpRequest, data: R, headers: Object | Headers);
}

export class HttpService {
        protected adapter: HttpAdapterContract;
        /**
            * @type {{}}
            */
        protected requestsInProgress: {
                [key: string]: Promise<HttpResponse<any>>;
        };
        /**
            * @type {Array}
            */
        protected requestInterceptors: RequestInterceptorContract[];
        /**
            * @type {Array}
            */
        protected responseInterceptors: ResponseInterceptorContract[];
        /**
            * @type {Array}
            */
        protected responseErrorInterceptors: ResponseInterceptorContract[];
        /**
            * @param adapter
            */
        constructor(adapter?: HttpAdapterContract);
        /**
            * @param interceptor
            * @returns {Function}
            */
        addRequestInterceptor(interceptor: RequestInterceptorContract): Function;
        /**
            * @param interceptor
            * @returns {Function}
            */
        addResponseInterceptor(interceptor: ResponseInterceptorContract): Function;
        /**
            * @param interceptor
            * @returns {Function}
            */
        addResponseErrorInterceptor(interceptor: ResponseInterceptorContract): Function;
        /**
            * @param request
            * @returns {Promise<T>}
            */
        send<T>(request: HttpRequest): Promise<HttpResponse<T>>;
}


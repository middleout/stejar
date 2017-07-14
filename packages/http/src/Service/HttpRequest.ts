export enum Method {
    GET = "GET" as any,
    POST = "POST" as any,
    PUT = "PUT" as any,
    DELETE = "DELETE" as any,
    PATCH = "PATCH" as any,
    OPTIONS = "OPTIONS" as any,
}

export class HttpRequest {
    /**
     * @type {number}
     */
    protected timeoutValue: number = 30000;

    /**
     * @type {Method}
     */
    protected method: Method = Method.GET;

    /**
     * @type {{}}
     */
    protected queryParams: any = {};

    /**
     * @type {{}}
     */
    protected headerParams: any = {};

    /**
     * @type {{}}
     */
    protected bodyParams: Blob | FormData | string = null;

    /**
     * @param path
     */
    constructor(protected path: string) {}

    /**
     * @returns {string}
     */
    getPath(): string {
        return this.path;
    }

    /**
     * @returns {Method}
     */
    getMethod(): Method {
        return this.method;
    }

    /**
     * @returns {number}
     */
    getTimeout(): number {
        return this.timeoutValue;
    }

    /**
     * @returns {Blob|FormData|string}
     */
    getBodyParams(): Blob | FormData | string {
        return this.bodyParams;
    }

    /**
     * @returns {Object}
     */
    getHeaderParams(): any {
        return this.headerParams;
    }

    /**
     * @returns {Object}
     */
    getQueryParams(): any {
        return this.queryParams;
    }

    /**
     * @param url
     * @returns {HttpRequest}
     */
    url(url: string): HttpRequest {
        const request = Object.assign(Object.create(this), this);
        request.path = url;
        return request;
    }

    /**
     * @param timeout
     * @returns {HttpRequest}
     */
    timeout(timeout: number): HttpRequest {
        const request = Object.assign(Object.create(this), this);
        request.timeoutValue = timeout;
        return request;
    }

    /**
     * @returns {HttpRequest}
     */
    post(): HttpRequest {
        const request = Object.assign(Object.create(this), this);
        request.method = Method.POST;
        return request;
    }

    /**
     * @returns {HttpRequest}
     */
    get(): HttpRequest {
        const request = Object.assign(Object.create(this), this);
        request.method = Method.GET;
        return request;
    }

    /**
     * @returns {HttpRequest}
     */
    patch(): HttpRequest {
        const request = Object.assign(Object.create(this), this);
        request.method = Method.PATCH;
        return request;
    }

    /**
     * @returns {HttpRequest}
     */
    put(): HttpRequest {
        const request = Object.assign(Object.create(this), this);
        request.method = Method.PUT;
        return request;
    }

    /**
     * @returns {HttpRequest}
     */
    delete(): HttpRequest {
        const request = Object.assign(Object.create(this), this);
        request.method = Method.DELETE;
        return request;
    }

    /**
     * @returns {HttpRequest}
     */
    options(): HttpRequest {
        const request = Object.assign(Object.create(this), this);
        request.method = Method.OPTIONS;
        return request;
    }

    /**
     * @param key
     * @param value
     * @returns {HttpRequest}
     */
    query(key: string, value: any | any[]): HttpRequest {
        const request = Object.assign(Object.create(this), this);
        request.queryParams[key] = value;
        return request;
    }

    /**
     * @param key
     * @param value
     * @returns {HttpRequest}
     */
    header(key: string, value: string): HttpRequest {
        const request = Object.assign(Object.create(this), this);
        request.headerParams[key] = value;
        return request;
    }

    /**
     * @returns {HttpRequest}
     */
    jsonHeaders(): HttpRequest {
        return this.header("Content-Type", "application/json");
    }

    /**
     * @param value
     * @returns {HttpRequest}
     */
    body(value: Blob | FormData | string): HttpRequest {
        const request = Object.assign(Object.create(this), this);
        request.bodyParams = value;
        return request;
    }
}

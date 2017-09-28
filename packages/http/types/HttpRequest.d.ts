export declare enum Method {
    GET,
    POST,
    PUT,
    DELETE,
    PATCH,
    OPTIONS,
}
export declare class HttpRequest {
    protected path: string;
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
    protected queryParams: any;
    /**
     * @type {{}}
     */
    protected headerParams: any;
    /**
     * @type {{}}
     */
    protected bodyParams: Blob | FormData | string;
    /**
     * @param path
     */
    constructor(path: string);
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
    getHeaderParams(): any;
    /**
     * @returns {Object}
     */
    getQueryParams(): any;
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

import { HttpAdapterContract } from "./HttpAdapterContract";
import { RequestInterceptorContract, ResponseInterceptorContract } from "./InterceptorContract";
import { HttpRequest } from "./HttpRequest";
import { HttpResponse } from "./HttpResponse";
export declare class HttpService {
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
    addRequestInterceptor(interceptor: RequestInterceptorContract): () => void;
    /**
     * @param interceptor
     * @returns {Function}
     */
    addResponseInterceptor(interceptor: ResponseInterceptorContract): () => void;
    /**
     * @param interceptor
     * @returns {Function}
     */
    addResponseErrorInterceptor(interceptor: ResponseInterceptorContract): () => void;
    /**
     * @param request
     * @returns {Promise<T>}
     */
    send<T>(request: HttpRequest): Promise<HttpResponse<T>>;
}

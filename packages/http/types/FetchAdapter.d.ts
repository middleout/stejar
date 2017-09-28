import { HttpAdapterContract } from "./HttpAdapterContract";
import { HttpRequest } from "./HttpRequest";
import { HttpResponse } from "./HttpResponse";
export declare class FetchAdapter implements HttpAdapterContract {
    constructor();
    /**
     * @param request
     * @returns {Promise<T>}
     */
    send<T>(request: HttpRequest): Promise<HttpResponse<T>>;
}

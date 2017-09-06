import { HttpAdapterContract } from "../Contract/HttpAdapterContract";
import { HttpRequest } from "../Service/HttpRequest";
import { HttpResponse } from "../Service/HttpResponse";
export declare class FetchAdapter implements HttpAdapterContract {
    constructor();
    /**
     * @param request
     * @returns {Promise<T>}
     */
    send<T>(request: HttpRequest): Promise<HttpResponse<T>>;
}

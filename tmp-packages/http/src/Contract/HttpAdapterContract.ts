import { HttpResponse } from "../Service/HttpResponse";
import { HttpRequest } from "../Service/HttpRequest";

export interface HttpAdapterContract {
    /**
     * @param request
     */
    send<T>(request: HttpRequest): Promise<HttpResponse<T>>;
}

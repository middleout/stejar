import { HttpResponse } from "./HttpResponse";
import { HttpRequest } from "./HttpRequest";
export interface HttpAdapterContract {
    /**
     * @param request
     */
    send<T>(request: HttpRequest): Promise<HttpResponse<T>>;
}

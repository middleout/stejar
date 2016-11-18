import {HttpRequest} from "./../Service/HttpRequest";
import {HttpResponse} from "../Service/HttpResponse";

export interface HttpAdapterContract {

    /**
     * @param request
     */
    send<T>( request: HttpRequest ): Promise<HttpResponse<T>>;
}
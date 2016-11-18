import {HttpRequest} from "../Service/HttpRequest";
import {HttpResponse} from "../Service/HttpResponse";

export interface RequestInterceptorContract {
    <R>( request: HttpRequest ): Promise<HttpRequest>|Promise<HttpResponse<R>>;
}

export interface ResponseInterceptorContract {
    <T>( response: HttpResponse<T> ): Promise<HttpResponse<T>>;
}
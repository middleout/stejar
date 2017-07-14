import { HttpRequest } from "../Service/HttpRequest";
import { HttpResponse } from "../Service/HttpResponse";

export type RequestInterceptorContract = <R>(request: HttpRequest) => Promise<HttpRequest> | Promise<HttpResponse<R>>;
export type ResponseInterceptorContract = <T>(response: HttpResponse<T>) => Promise<HttpResponse<T>>;

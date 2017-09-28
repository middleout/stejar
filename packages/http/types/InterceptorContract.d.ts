import { HttpRequest } from "./HttpRequest";
import { HttpResponse } from "./HttpResponse";
export declare type RequestInterceptorContract = <R>(request: HttpRequest) => Promise<HttpRequest> | Promise<HttpResponse<R>>;
export declare type ResponseInterceptorContract = <T>(response: HttpResponse<T>) => Promise<HttpResponse<T>>;

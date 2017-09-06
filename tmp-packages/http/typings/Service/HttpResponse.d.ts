import { HttpRequest } from "./HttpRequest";
export declare class HttpResponse<R> {
    statusCode: number;
    statusText: string;
    request: HttpRequest;
    data: R;
    headers: any | Headers;
    /**
     * @param statusCode
     * @param statusText
     * @param request
     * @param data
     * @param headers
     */
    constructor(statusCode: number, statusText: string, request: HttpRequest, data: R, headers: any | Headers);
}

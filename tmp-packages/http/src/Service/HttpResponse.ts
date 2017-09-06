import { HttpRequest } from "./HttpRequest";

export class HttpResponse<R> {
    /**
     * @param statusCode
     * @param statusText
     * @param request
     * @param data
     * @param headers
     */
    constructor(
        public statusCode: number,
        public statusText: string,
        public request: HttpRequest,
        public data: R,
        public headers: any | Headers
    ) {}
}

export class HttpResponse {
    /**
     * @param statusCode
     * @param statusText
     * @param request
     * @param data
     * @param headers
     */
    constructor(statusCode, statusText, request, data, headers) {
        this.statusCode = statusCode;
        this.statusText = statusText;
        this.request = request;
        this.data = data;
        this.headers = headers;
    }
}

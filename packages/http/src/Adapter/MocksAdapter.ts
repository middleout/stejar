import { HttpAdapterContract } from "../Contract/HttpAdapterContract";
import { HttpRequest } from "../Service/HttpRequest";
import { HttpResponse } from "../Service/HttpResponse";
const debug = console ? console.log : (...args: any[]) => {};

export class MocksAdapter implements HttpAdapterContract {
    /**
     * @type {{}}
     */
    protected mocks = {};

    /**
     * @param debugFlag
     */
    constructor(protected debugFlag: boolean = true) {}

    /**
     * @param match
     * @param method
     * @param response
     */
    mock(match: any, method: string, response: (request: HttpRequest) => Promise<any>) {
        this.mocks[match] = {
            method,
            response,
        };
    }

    /**
     * @param request
     * @returns {null}
     */
    send<T>(request: HttpRequest): Promise<HttpResponse<T>> {
        if (this.debugFlag) {
            debug("Requesting " + request.getPath());
        }

        let found = false;
        let response: Promise<any> = null;
        Object.keys(this.mocks).forEach(key => {
            if (found) {
                return;
            }

            if (request.getPath().match(new RegExp(key))) {
                if (this.mocks[key].method.toLowerCase() === (request.getMethod() as any).toLowerCase()) {
                    found = true;
                    response = this.mocks[key].response(request);
                }
            }
        });

        if (!found) {
            return Promise.reject(
                new HttpResponse(
                    0,
                    "Mocks error",
                    request,
                    `[MOCKS ADAPTER] No match found for ${request.getPath()}`,
                    {}
                )
            ) as any;
        }

        return response.then(result => {
            if (this.debugFlag) {
                debug("Loaded " + request.getPath(), result);
            }

            if (result instanceof HttpResponse) {
                return result;
            }

            return new HttpResponse(200, "OK", request, result, {});
        });
    }
}

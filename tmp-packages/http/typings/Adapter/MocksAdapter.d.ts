import { HttpAdapterContract } from "../Contract/HttpAdapterContract";
import { HttpRequest } from "../Service/HttpRequest";
import { HttpResponse } from "../Service/HttpResponse";
export declare class MocksAdapter implements HttpAdapterContract {
    protected debugFlag: boolean;
    /**
     * @type {{}}
     */
    protected mocks: {};
    /**
     * @param debugFlag
     */
    constructor(debugFlag?: boolean);
    /**
     * @param match
     * @param method
     * @param response
     */
    mock(match: any, method: string, response: (request: HttpRequest) => Promise<any>): void;
    /**
     * @param request
     * @returns {null}
     */
    send<T>(request: HttpRequest): Promise<HttpResponse<T>>;
}

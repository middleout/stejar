import { HttpResponse } from "./HttpResponse";
const debug = console ? console.log : () => {};

export class MocksAdapter {
    /**
     * @type {{}}
     */
    _mocks = {};

    /**
     * @param debugFlag
     */
    constructor(debugFlag = false) {
        this._debugFlag = debugFlag;
    }

    /**
     * @param match
     * @param method
     * @param response
     */
    mock(match, method, response) {
        this._mocks[match] = {
            method,
            response,
        };
    }

    /**
     * @param request
     * @returns {Promise.<*>}
     */
    send(request) {
        if (this._debugFlag) {
            debug("Requesting " + request.getPath());
        }

        let found = false;
        let response = null;
        Object.keys(this._mocks).forEach(key => {
            if (found) {
                return;
            }

            if (request.getPath().match(new RegExp(key))) {
                if (this._mocks[key].method.toLowerCase() === request.getMethod().toLowerCase()) {
                    found = true;
                    response = this._mocks[key].response(request);
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
            );
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

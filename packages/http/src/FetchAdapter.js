import each from "lodash.foreach";
import isEmpty from "lodash.isempty";
import trimEnd from "lodash.trimend";
import { HttpResponse } from "./HttpResponse";

export class FetchAdapter {
    /**
     * @constructor
     */
    constructor() {
        if (!window.fetch) {
            console.warn(
                'fetch() not found. Try to "npm i isomorphic-fetch" and then " import "isomorphic-fetch" before constructing the FetchAdapter"'
            );
            throw new Error("Fetch() is not defined. Did you forget to polyfill it?");
        }
    }

    /**
     * @param request
     * @returns {Promise<T>}
     */
    send(request) {
        const requestConfig = {
            cache: "no-cache",
            method: request.getMethod(),
        };

        let url = request.getPath();

        const timeout = request.getTimeout();

        if (request.getBodyParams()) {
            requestConfig.body = request.getBodyParams();
        }

        if (!isEmpty(request.getHeaderParams())) {
            if (!requestConfig.headers) {
                requestConfig.headers = {};
            }
            each(request.getHeaderParams(), (value, name) => {
                requestConfig.headers[name] = value;
            });
        }

        if (!isEmpty(request.getQueryParams())) {
            url += "?";
            each(request.getQueryParams(), (param, name) => {
                if (Array.isArray(param)) {
                    param.forEach(value => {
                        url += `${name}[]=${value}&`;
                    });
                } else {
                    url += `${name}=${param}&`;
                }
            });
            url = trimEnd(url, "&");
        }

        return new Promise((resolve, reject) => {
            let rejected = false;

            const timeoutInterval = setTimeout(() => {
                rejected = true;
                reject(
                    new HttpResponse(
                        0,
                        "Application error",
                        request,
                        "Timeout of " + timeout + "ms exceeded for " + url,
                        {}
                    )
                );
            }, timeout);

            function returnAsJSON(response, jsonRequest, callback) {
                const cloned = response.clone();

                cloned.text().then(data => {
                    let responseData = data;
                    try {
                        responseData = JSON.parse(data);
                    } catch (error) {} // eslint-disable-line no-empty

                    callback(
                        new HttpResponse(
                            response.status,
                            response.statusText,
                            jsonRequest,
                            responseData,
                            response.headers
                        )
                    );
                });
            }

            fetch(url, requestConfig).then(
                response => {
                    if (rejected) {
                        return;
                    }
                    clearTimeout(timeoutInterval);

                    if (response.status >= 200 && response.status < 300) {
                        returnAsJSON(response, request, resolve);
                        return;
                    }

                    returnAsJSON(response, request, reject);
                    return;
                },
                error => {
                    if (!rejected) {
                        reject(new HttpResponse(0, "Fetch error", request, error, {}));
                    }
                }
            );
        });
    }
}

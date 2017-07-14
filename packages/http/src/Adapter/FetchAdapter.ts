import { each, isArray, isEmpty, trimEnd } from "lodash";
import { HttpAdapterContract } from "../Contract/HttpAdapterContract";
import { HttpRequest } from "../Service/HttpRequest";
import { HttpResponse } from "../Service/HttpResponse";

export class FetchAdapter implements HttpAdapterContract {
    constructor() {
        if (!(window as any).fetch) {
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
    send<T>(request: HttpRequest): Promise<HttpResponse<T>> {
        const requestConfig: RequestInit = {
            cache: "no-cache",
            method: request.getMethod() as any,
        };

        let url: string = request.getPath();

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
                if (isArray(param)) {
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

            const timeoutInterval: any = setTimeout(() => {
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

            function returnAsJSON<P>(response: any, jsonRequest: HttpRequest, callback: (request: HttpResponse<P>) => any) {
                const cloned = response.clone();

                cloned.text().then((data: any) => {
                    let responseData = data;
                    try {
                        responseData = JSON.parse(data);
                    } catch (error) {}

                    callback(
                        new HttpResponse(response.status, response.statusText, jsonRequest, responseData, response.headers)
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

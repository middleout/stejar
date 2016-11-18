import { isEmpty, each, isArray, trimEnd } from "lodash";
import { HttpRequest } from "./../Service/HttpRequest";
import { HttpAdapterContract } from "./../Contract/HttpAdapterContract";
import { HttpResponse } from "../Service/HttpResponse";

export class FetchAdapter implements HttpAdapterContract {

	/**
	 * @param request
	 * @returns {Promise<T>}
	 */
	send<T>( request: HttpRequest ): Promise<HttpResponse<T>> {

		let requestConfig: RequestInit = {
			cache : "no-cache",
			method: request.getMethod() as any,
		};

		let url: string = request.getPath();

		let timeout = request.getTimeout();

		if ( request.getBodyParams() ) {
			requestConfig.body = request.getBodyParams();
		}

		if ( !isEmpty(request.getHeaderParams()) ) {
			if ( !requestConfig.headers ) {
				requestConfig.headers = {};
			}
			each(request.getHeaderParams(), ( value, name ) => {
				requestConfig.headers[ name ] = value;
			});
		}

		if ( !isEmpty(request.getQueryParams()) ) {
			url += '?';
			each(request.getQueryParams(), ( param, name ) => {
				if ( isArray(param) ) {
					param.forEach(value => {
						url += `${name}[]=${value}&`;
					})
				} else {
					url += `${name}=${param}&`;
				}
			});
			url = trimEnd(url, '&');
		}

		return new Promise(( resolve, reject ) => {
			let rejected = false;

			let timeoutInterval: any = setTimeout(
				() => {
					rejected = true;
					reject(new HttpResponse(0, 'Application error', request, 'Timeout of ' + timeout + 'ms exceeded for ' + url, {}));
				},
				timeout
			);

			function returnAsJSON( response: any, request: HttpRequest, callback: Function ) {
				const cloned = response.clone();

				cloned
					.text()
					.then(( data: any ) => {
						let responseData = data;
						try {
							responseData = JSON.parse(data);
						} catch (error) {
						}

						callback(new HttpResponse(response.status, response.statusText, request, responseData, response.headers))
					});
			}

			fetch(url, requestConfig).then(
				response => {
					if ( rejected ) {
						return;
					}
					clearTimeout(timeoutInterval);

					if ( response.status >= 200 && response.status < 300 ) {
						returnAsJSON(response, request, resolve);
						return;
					}

					returnAsJSON(response, request, reject);
					return;
				},
				error => {
					if ( !rejected ) {
						reject(new HttpResponse(0, 'Fetch error', request, error, {}));
					}
				}
			);
		});
	}
}

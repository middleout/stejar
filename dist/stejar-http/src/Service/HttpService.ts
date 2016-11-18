import { HttpAdapterContract } from "../Contract/HttpAdapterContract";
import { HttpRequest } from "./HttpRequest";
import { HttpResponse } from "./HttpResponse";
import { FetchAdapter } from "./../Adapter/FetchAdapter";
import { RequestInterceptorContract, ResponseInterceptorContract } from "../Contract/InterceptorContract";

export class HttpService {

	/**
	 * @type {{}}
	 */
	protected requestsInProgress: {[key: string]: Promise<HttpResponse<any>>} = {};

	/**
	 * @type {Array}
	 */
	protected requestInterceptors: RequestInterceptorContract[] = [];

	/**
	 * @type {Array}
	 */
	protected responseInterceptors: ResponseInterceptorContract[] = [];

	/**
	 * @type {Array}
	 */
	protected responseErrorInterceptors: ResponseInterceptorContract[] = [];

	/**
	 * @param adapter
	 */
	constructor(
		protected adapter: HttpAdapterContract = new FetchAdapter()
	) {
	}

	/**
	 * @param interceptor
	 * @returns {Function}
	 */
	addRequestInterceptor( interceptor: RequestInterceptorContract ): Function {
		this.requestInterceptors.push(interceptor);
		return () => {
			const $index = this.requestInterceptors.indexOf(interceptor);
			this.requestInterceptors.splice($index, 1);
		};
	}

	/**
	 * @param interceptor
	 * @returns {Function}
	 */
	addResponseInterceptor( interceptor: ResponseInterceptorContract ): Function {
		this.responseInterceptors.push(interceptor);
		return () => {
			const $index = this.responseInterceptors.indexOf(interceptor);
			this.responseInterceptors.splice($index, 1);
		};
	}

	/**
	 * @param interceptor
	 * @returns {Function}
	 */
	addResponseErrorInterceptor( interceptor: ResponseInterceptorContract ): Function {
		this.responseErrorInterceptors.push(interceptor);
		return () => {
			const $index = this.responseErrorInterceptors.indexOf(interceptor);
			this.responseInterceptors.splice($index, 1);
		};
	}

	/**
	 * @param request
	 * @returns {Promise<T>}
	 */
	send<T>( request: HttpRequest ): Promise<HttpResponse<T>> {
		let promise: Promise<HttpRequest> = Promise.resolve(request);

		for ( var i = 0; i < this.requestInterceptors.length; i++ ) {
			promise = promise.then(this.requestInterceptors[ i ] as any);
		}

		let hashKeys: string[] = [];

		return promise
			.then(( newRequest: any ) => {
				const hashKey = JSON.stringify(newRequest);
				if ( this.requestsInProgress[ hashKey ] ) {
					return this.requestsInProgress[ hashKey ];
				}
				hashKeys.push(hashKey);

				if ( newRequest instanceof HttpResponse ) {
					return newRequest;
				}

				this.requestsInProgress[ hashKey ] = this.adapter.send<T>(newRequest);
				return this.requestsInProgress[ hashKey ];
			})
			.then(response => {
				hashKeys.forEach(hashKey => delete this.requestsInProgress[ hashKey ]);
				return response;
			})
			.then(response => {
				let promise = Promise.resolve(response);
				for ( var i = 0; i < this.responseInterceptors.length; i++ ) {
					promise = promise.then(this.responseInterceptors[ i ]);
				}

				return promise;
			})
			.catch(( error ) => {
				hashKeys.forEach(hashKey => delete this.requestsInProgress[ hashKey ]);

				if ( this.responseErrorInterceptors.length === 0 ) {
					return Promise.reject(error);
				}

				let promise: any = Promise.resolve(error);
				for ( var i = 0; i < this.responseErrorInterceptors.length; i++ ) {
					promise = promise.then(this.responseErrorInterceptors[ i ] as any).catch(( error: any) => {throw error});
				}

				return promise;
			})
	}
}

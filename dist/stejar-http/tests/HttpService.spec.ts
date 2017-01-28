import "core-js/es6";
import "core-js/es7";
import { HttpRequest, Method } from "../src/Service/HttpRequest";
import { MocksAdapter } from "../src/Adapter/MocksAdapter";
import { HttpService } from "../src/Service/HttpService";
import { HttpResponse } from "../src/Service/HttpResponse";

describe("HttpService", () => {
	it('should be able to run a request', ( done ) => {

		const request = new HttpRequest('http://test.com');
		const adapter = new MocksAdapter();
		adapter.mock('test.com', Method.GET as any, ( request: HttpRequest ) => {
			expect(request.getPath()).toEqual('http://test.com');
			return new Promise(( resolve ) => resolve('OK'));
		});

		const http = new HttpService(adapter);
		http.send(request).then(response => {
			expect(response.data).toEqual('OK');
			done();
		});

	});

	it('should be able to run only a request if 2 in progress', ( done ) => {

		const request = new HttpRequest('http://test.com');
		const adapter = new MocksAdapter();
		adapter.mock('test.com', Method.GET as any, ( request: HttpRequest ) => {
			expect(request.getPath()).toEqual('http://test.com');
			return new Promise(( resolve ) => resolve('OK'));
		});

		const http = new HttpService(adapter);

		Promise.all([
			http.send(request).then(response => {
				expect(response.data).toEqual('OK');
			}),
			http.send(request).then(response => {
				expect(response.data).toEqual('OK');
			})
		]).then(() => done()).catch(error => done.fail(error));
	});

	it('should be able to run with a request interceptor', ( done ) => {

		const request = new HttpRequest('http://test.com');
		const adapter = new MocksAdapter();
		adapter.mock('test.com', Method.GET as any, ( request: HttpRequest ) => {
			expect(request.getPath()).toEqual('http://test.com');
			return new Promise(( resolve ) => resolve('OK'));
		});

		const http = new HttpService(adapter);
		http.addRequestInterceptor(( request: HttpRequest ) => Promise.resolve(request));
		http.send(request).then(response => {
			expect(response.data).toEqual('OK');
			done();
		});
	});

	it('should be able to run with a request interceptor that modifies the request', ( done ) => {

		const request = new HttpRequest('http://test.com');
		const adapter = new MocksAdapter();
		adapter.mock('test.com', Method.GET as any, ( request: HttpRequest ) => {
			expect(request.getPath()).toEqual('http://test.com');
			return new Promise(( resolve ) => resolve('OK'));
		});
		adapter.mock('example.com', Method.GET as any, ( request: HttpRequest ) => {
			expect(request.getPath()).toEqual('http://example.com');
			return new Promise(( resolve ) => resolve('I WAS MODIFIED'));
		});
		adapter.mock('blabla.com', Method.GET as any, ( request: HttpRequest ) => {
			expect(request.getPath()).toEqual('http://blabla.com');
			return new Promise(( resolve ) => resolve('I WAS MODIFIED the 2nd time'));
		});

		const http = new HttpService(adapter);
		http.addRequestInterceptor(( request: HttpRequest ) => Promise.resolve(new HttpRequest('http://example.com')));
		http.addRequestInterceptor(( request: HttpRequest ) => Promise.resolve(new HttpRequest('http://blabla.com')));

		Promise.all([
			http.send(request).then(response => {
				expect(response.data).toEqual('I WAS MODIFIED the 2nd time', 'First request');
			}),
			http.send(request).then(response => {
				expect(response.data).toEqual('I WAS MODIFIED the 2nd time', 'Second request');
			})
		]).then(() => done()).catch(error => done.fail(error));
	});

	it('should be able to run with a request interceptor but removing it', ( done ) => {

		const request = new HttpRequest('http://test.com');
		const adapter = new MocksAdapter();
		adapter.mock('test.com', Method.GET as any, ( request: HttpRequest ) => {
			expect(request.getPath()).toEqual('http://test.com');
			return new Promise(( resolve ) => resolve('OK'));
		});
		adapter.mock('example.com', Method.GET as any, ( request: HttpRequest ) => {
			expect(request.getPath()).toEqual('http://example.com');
			return new Promise(( resolve ) => resolve('SHOULD NOT BE HERE'));
		});

		const http    = new HttpService(adapter);
		const remover = http.addRequestInterceptor(( request: HttpRequest ) => Promise.resolve(new HttpRequest('http://example.com')));
		remover();
		http.send(request).then(response => {
			expect(response.data).toEqual('OK');
			done();
		});
	});

	it('should be able to run with a response interceptor', ( done ) => {

		const request = new HttpRequest('http://test.com');
		const adapter = new MocksAdapter();
		adapter.mock('test.com', Method.GET as any, ( request: HttpRequest ) => {
			expect(request.getPath()).toEqual('http://test.com');
			return new Promise(( resolve ) => resolve('OK'));
		});

		const http = new HttpService(adapter);
		http.addResponseInterceptor(( response: HttpResponse<any> ) => Promise.resolve(new HttpResponse(200, 'OK', request, 'I AM A NEW RESPONSE', {})));
		http.send(request).then(response => {
			expect(response.data).toEqual('I AM A NEW RESPONSE');
			done();
		});
	});

	it('should be able to run with 2 response interceptor', ( done ) => {

		const request = new HttpRequest('http://test.com');
		const adapter = new MocksAdapter();
		adapter.mock('test.com', Method.GET as any, ( request: HttpRequest ) => {
			expect(request.getPath()).toEqual('http://test.com');
			return new Promise(( resolve ) => resolve('OK'));
		});

		const http = new HttpService(adapter);
		http.addResponseInterceptor(( response: HttpResponse<any> ) => Promise.resolve(new HttpResponse(200, 'OK', request, 'I AM A NEW RESPONSE', {})));
		http.addResponseInterceptor(( response: HttpResponse<any> ) => Promise.resolve(new HttpResponse(200, 'OK', request, 'I AM A 2ND RESPONSE', {})));
		http.send(request).then(response => {
			expect(response.data).toEqual('I AM A 2ND RESPONSE');
			done();
		});
	});

	it('should be able to run with a request interceptor but removing it', ( done ) => {

		const request = new HttpRequest('http://test.com');
		const adapter = new MocksAdapter();
		adapter.mock('test.com', Method.GET as any, ( request: HttpRequest ) => {
			expect(request.getPath()).toEqual('http://test.com');
			return new Promise(( resolve ) => resolve('OK'));
		});

		const http    = new HttpService(adapter);
		const remover = http.addResponseInterceptor(( response: HttpResponse<any> ) => Promise.resolve(new HttpResponse(200, 'OK', request, 'I AM A NEW RESPONSE', {})));
		remover();
		http.send(request).then(response => {
			expect(response.data).toEqual('OK');
			done();
		});
	});

	it('should be able to run with a request, give 401, run another request then recall the initial request', ( done ) => {

		let firstTry = true;

		const request = new HttpRequest('http://test.com');
		const adapter = new MocksAdapter();
		adapter.mock('test.com', Method.GET as any, ( request: HttpRequest ) => {
			if ( firstTry ) {
				firstTry = false;
				return Promise.reject(new HttpResponse(401, 'Not Authorized', request, null, {'status': '401 Not authorized'}));
			}

			return new Promise(( resolve ) => resolve('OK'));
		});
		adapter.mock('auth.com', Method.GET as any, () => {
			return new Promise(( resolve ) => resolve('Authenticated'));
		});

		const http = new HttpService(adapter);
		http.addResponseErrorInterceptor(( response: HttpResponse<any> ) => {
			if ( response.statusCode === 401 ) {
				const request = new HttpRequest('http://auth.com');
				return http.send(request).then(() => http.send(response.request));
			}

			return Promise.reject(response) as any;
		});
		http
			.send(request)
			.then(response => {
				expect(response.data).toEqual('OK');
				done();
			})
			.catch(error => done.fail(JSON.stringify(error)));
	});

	it('should be able to run with 2 requests, each give 401, run another request then recall the initial requests', ( done ) => {

		let hasAuth1 = false;
		let hasAuth2 = false;

		const request1 = new HttpRequest('http://test1.com');
		const request2 = new HttpRequest('http://test2.com');

		const adapter = new MocksAdapter();
		adapter.mock('test1.com', Method.GET as any, ( request: HttpRequest ) => {
			if ( !hasAuth1 ) {
				hasAuth1 = true;
				return Promise.reject(new HttpResponse(401, 'Not Authorized', request, null, {'status': '401 Not authorized'}));
			}

			return new Promise(( resolve ) => resolve('OK1'));
		});
		adapter.mock('test2.com', Method.GET as any, ( request: HttpRequest ) => {
			if ( !hasAuth2 ) {
				hasAuth2 = true;
				return Promise.reject(new HttpResponse(401, 'Not Authorized', request, null, {'status': '401 Not authorized'}));
			}

			return new Promise(( resolve ) => resolve('OK2'));
		});

		adapter.mock('auth.com', Method.GET as any, () => {
			return new Promise(( resolve ) => resolve('Authenticated'));
		});

		const http = new HttpService(adapter);

		http.addResponseErrorInterceptor(( response: HttpResponse<any> ) => {
			if ( response.statusCode === 401 ) {
				const request = new HttpRequest('http://auth.com');
				return http.send(request).then(() => http.send(response.request));
			}

			return Promise.reject(response) as any;
		});

		Promise.all([
			http.send(request1),
			http.send(request2),
		]).then(response => {
			expect(response[ 0 ].data).toEqual('OK1');
			expect(response[ 1 ].data).toEqual('OK2');
			done();
		}).catch(error => done.fail(JSON.stringify(error)));
	});
});

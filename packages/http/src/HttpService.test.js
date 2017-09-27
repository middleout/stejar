// import "core-js/es6";
// import "core-js/es7";
import { MocksAdapter } from "./MocksAdapter";
import { HttpRequest, Method } from "./HttpRequest";
import { HttpResponse } from "./HttpResponse";
import { HttpService } from "./HttpService";

test("should be able to run a request", async () => {
    const request = new HttpRequest("http://test.com");
    const adapter = new MocksAdapter(false);
    adapter.mock("test.com", Method.GET, requestParam => {
        expect(requestParam.getPath()).toEqual("http://test.com");
        return new Promise(resolve => resolve("OK"));
    });

    const http = new HttpService(adapter);
    const response = await http.send(request);
    expect(response.data).toEqual("OK");
});

test("should be able to run only a request if 2 in progress", async () => {
    const request = new HttpRequest("http://test.com");
    const adapter = new MocksAdapter(false);
    adapter.mock("test.com", Method.GET, requestParam => {
        expect(requestParam.getPath()).toEqual("http://test.com");
        return new Promise(resolve => resolve("OK"));
    });

    const http = new HttpService(adapter);

    const response = await Promise.all([http.send(request), http.send(request)]);

    expect(response[0].data).toEqual("OK");
    expect(response[1].data).toEqual("OK");
});

test("should be able to run with a request interceptor", done => {
    const request = new HttpRequest("http://test.com");
    const adapter = new MocksAdapter(false);
    adapter.mock("test.com", Method.GET, requestParam => {
        expect(requestParam.getPath()).toEqual("http://test.com");
        return new Promise(resolve => resolve("OK"));
    });

    const http = new HttpService(adapter);
    http.addRequestInterceptor(requestParam => Promise.resolve(requestParam));
    http.send(request).then(response => {
        expect(response.data).toEqual("OK");
        done();
    });
});

test("should be able to run with a request interceptor that modifies the request", async () => {
    const request = new HttpRequest("http://test.com");
    const adapter = new MocksAdapter(false);
    adapter.mock("test.com", Method.GET, requestParam => {
        expect(requestParam.getPath()).toEqual("http://test.com");
        return new Promise(resolve => resolve("OK"));
    });
    adapter.mock("example.com", Method.GET, requestParam => {
        expect(requestParam.getPath()).toEqual("http://example.com");
        return new Promise(resolve => resolve("I WAS MODIFIED"));
    });
    adapter.mock("blabla.com", Method.GET, requestParam => {
        expect(requestParam.getPath()).toEqual("http://blabla.com");
        return new Promise(resolve => resolve("I WAS MODIFIED the 2nd time"));
    });

    const http = new HttpService(adapter);
    http.addRequestInterceptor(() => Promise.resolve(new HttpRequest("http://example.com")));
    http.addRequestInterceptor(() => Promise.resolve(new HttpRequest("http://blabla.com")));

    const responses = await Promise.all([http.send(request), http.send(request)]);

    expect(responses[0].data).toEqual("I WAS MODIFIED the 2nd time");
    expect(responses[1].data).toEqual("I WAS MODIFIED the 2nd time");
});

test("should be able to run with a request interceptor but removing it", done => {
    const request = new HttpRequest("http://test.com");
    const adapter = new MocksAdapter(false);
    adapter.mock("test.com", Method.GET, requestParam => {
        expect(requestParam.getPath()).toEqual("http://test.com");
        return new Promise(resolve => resolve("OK"));
    });
    adapter.mock("example.com", Method.GET, requestParam => {
        expect(requestParam.getPath()).toEqual("http://example.com");
        return new Promise(resolve => resolve("SHOULD NOT BE HERE"));
    });

    const http = new HttpService(adapter);
    const remover = http.addRequestInterceptor(() => Promise.resolve(new HttpRequest("http://example.com")));
    remover();
    http.send(request).then(response => {
        expect(response.data).toEqual("OK");
        done();
    });
});

test("should be able to run with a response interceptor", done => {
    const request = new HttpRequest("http://test.com");
    const adapter = new MocksAdapter(false);
    adapter.mock("test.com", Method.GET, requestParam => {
        expect(requestParam.getPath()).toEqual("http://test.com");
        return new Promise(resolve => resolve("OK"));
    });

    const http = new HttpService(adapter);
    http.addResponseInterceptor(() => Promise.resolve(new HttpResponse(200, "OK", request, "I AM A NEW RESPONSE", {})));
    http.send(request).then(response => {
        expect(response.data).toEqual("I AM A NEW RESPONSE");
        done();
    });
});

test("should be able to run with 2 response interceptor", done => {
    const request = new HttpRequest("http://test.com");
    const adapter = new MocksAdapter(false);
    adapter.mock("test.com", Method.GET, requestParam => {
        expect(requestParam.getPath()).toEqual("http://test.com");
        return new Promise(resolve => resolve("OK"));
    });

    const http = new HttpService(adapter);
    http.addResponseInterceptor(() => Promise.resolve(new HttpResponse(200, "OK", request, "I AM A NEW RESPONSE", {})));
    http.addResponseInterceptor(() => Promise.resolve(new HttpResponse(200, "OK", request, "I AM A 2ND RESPONSE", {})));
    http.send(request).then(response => {
        expect(response.data).toEqual("I AM A 2ND RESPONSE");
        done();
    });
});

test("should be able to run with a request interceptor but removing it", done => {
    const request = new HttpRequest("http://test.com");
    const adapter = new MocksAdapter(false);
    adapter.mock("test.com", Method.GET, requestParam => {
        expect(requestParam.getPath()).toEqual("http://test.com");
        return new Promise(resolve => resolve("OK"));
    });

    const http = new HttpService(adapter);
    const remover = http.addResponseInterceptor(() =>
        Promise.resolve(new HttpResponse(200, "OK", request, "I AM A NEW RESPONSE", {}))
    );
    remover();
    http.send(request).then(response => {
        expect(response.data).toEqual("OK");
        done();
    });
});

test("should be able to run with a request, give 401, run another request then recall the initial request", done => {
    let firstTry = true;

    const request = new HttpRequest("http://test.com");
    const adapter = new MocksAdapter(false);
    adapter.mock("test.com", Method.GET, requestParam => {
        if (firstTry) {
            firstTry = false;
            return Promise.reject(
                new HttpResponse(401, "Not Authorized", requestParam, null, { status: "401 Not authorized" })
            );
        }

        return new Promise(resolve => resolve("OK"));
    });
    adapter.mock("auth.com", Method.GET, () => {
        return new Promise(resolve => resolve("Authenticated"));
    });

    const http = new HttpService(adapter);
    http.addResponseErrorInterceptor(response => {
        if (response.statusCode === 401) {
            const requestParam = new HttpRequest("http://auth.com");
            return http.send(requestParam).then(() => http.send(response.request));
        }

        return Promise.reject(response);
    });
    http
        .send(request)
        .then(response => {
            expect(response.data).toEqual("OK");
            done();
        })
        .catch(error => done.fail(JSON.stringify(error)));
});

test("should be able to run with 2 requests, each give 401, run another request then recall the initial requests", done => {
    let hasAuth1 = false;
    let hasAuth2 = false;

    const request1 = new HttpRequest("http://test1.com");
    const request2 = new HttpRequest("http://test2.com");

    const adapter = new MocksAdapter(false);
    adapter.mock("test1.com", Method.GET, request => {
        if (!hasAuth1) {
            hasAuth1 = true;
            return Promise.reject(
                new HttpResponse(401, "Not Authorized", request, null, { status: "401 Not authorized" })
            );
        }

        return new Promise(resolve => resolve("OK1"));
    });
    adapter.mock("test2.com", Method.GET, request => {
        if (!hasAuth2) {
            hasAuth2 = true;
            return Promise.reject(
                new HttpResponse(401, "Not Authorized", request, null, { status: "401 Not authorized" })
            );
        }

        return new Promise(resolve => resolve("OK2"));
    });

    adapter.mock("auth.com", Method.GET, () => {
        return new Promise(resolve => resolve("Authenticated"));
    });

    const http = new HttpService(adapter);

    http.addResponseErrorInterceptor(response => {
        if (response.statusCode === 401) {
            const request = new HttpRequest("http://auth.com");
            return http.send(request).then(() => http.send(response.request));
        }

        return Promise.reject(response);
    });

    Promise.all([http.send(request1), http.send(request2)])
        .then(response => {
            expect(response[0].data).toEqual("OK1");
            expect(response[1].data).toEqual("OK2");
            done();
        })
        .catch(error => done.fail(JSON.stringify(error)));
});

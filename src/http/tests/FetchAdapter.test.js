import mock from "fetch-mock";
import { FetchAdapter } from "./../src/FetchAdapter";
import { HttpRequest } from "./../src/HttpRequest";

beforeEach(() => {
    mock.restore();
});

test("Fetch Adapter", async () => {
    mock.mock({
        matcher: "http://example.url",
        method: "GET",
        response: "Hello World",
    });

    const request = new HttpRequest("http://example.url");
    const adapter = new FetchAdapter();
    const response = await adapter.send(request);

    expect(response.data).toEqual("Hello World");
});

test("Should be able to make a request with body params", done => {
    mock.mock({
        matcher: "http://example.url",
        method: "POST",
        response: "Hello World",
    });

    const request = new HttpRequest("http://example.url").body("test body").post();
    const adapter = new FetchAdapter();
    adapter
        .send(request)
        .then(response => {
            expect(response.data).toEqual("Hello World");
            done();
        })
        .catch(error => {
            done.fail(error);
        });
});

test("Should be able to make a request with headers", done => {
    mock.mock({
        matcher: "http://example.url",
        method: "GET",
        response: "Hello World",
    });

    const request = new HttpRequest("http://example.url").header("test", "value");
    const adapter = new FetchAdapter();
    adapter
        .send(request)
        .then(response => {
            expect(response.data).toEqual("Hello World");
            done();
        })
        .catch(error => {
            done.fail(error);
        });
});

test("Should be able to make a request with query params", done => {
    mock.mock({
        matcher: "http://example.url?a=b",
        method: "GET",
        response: "Hello World",
    });

    const request = new HttpRequest("http://example.url").query("a", "b");
    const adapter = new FetchAdapter();
    adapter
        .send(request)
        .then(response => {
            expect(response.data).toEqual("Hello World");
            done();
        })
        .catch(error => {
            done.fail(error);
        });
});

test("Should be able to make a request with query params as array", done => {
    mock.mock({
        matcher: "http://example.url?a[]=1&a[]=2",
        method: "GET",
        response: "Hello World",
    });

    const request = new HttpRequest("http://example.url").query("a", [1, 2]);
    const adapter = new FetchAdapter();
    adapter
        .send(request)
        .then(response => {
            expect(response.data).toEqual("Hello World");
            done();
        })
        .catch(error => {
            done.fail(error);
        });
});

test("Should be able to fail a request with a timeout exceeded", done => {
    mock.mock("http://example.url", () => new Promise(resolve => setTimeout(() => resolve(), 5000)));

    const request = new HttpRequest("http://example.url").timeout(100);
    const adapter = new FetchAdapter();
    adapter
        .send(request)
        .then(() => {
            done.fail("The request passed");
        })
        .catch(error => {
            expect(error.data).toEqual("Timeout of 100ms exceeded for http://example.url");
            done();
        });
});

test("Should be able to return a JSON", done => {
    mock.mock("http://example.url", JSON.stringify({ hello: "world" }));

    const request = new HttpRequest("http://example.url").jsonHeaders();
    const adapter = new FetchAdapter();
    adapter
        .send(request)
        .then(response => {
            expect(response.data).toEqual({ hello: "world" });
            done();
        })
        .catch(error => {
            done.fail(error);
        });
});

test("Should be able to fail a request", done => {
    mock.mock({
        matcher: "http://example.url",
        response: () => Promise.reject("some reason"),
    });

    const request = new HttpRequest("http://example.url").jsonHeaders();
    const adapter = new FetchAdapter();
    adapter
        .send(request)
        .then(() => {
            done.fail("Request has passed");
        })
        .catch(error => {
            expect(error.data).toEqual("some reason");
            done();
        });
});

test("Should be able to fail a request due to headers", done => {
    mock.mock({
        matcher: "http://example.url",
        response: {
            body: "Some error",
            status: 401,
        },
    });

    const request = new HttpRequest("http://example.url").jsonHeaders();
    const adapter = new FetchAdapter();
    adapter
        .send(request)
        .then(() => {
            done.fail("Request has passed");
        })
        .catch(error => {
            expect(error.data).toEqual("Some error");
            done();
        });
});

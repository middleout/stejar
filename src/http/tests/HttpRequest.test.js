import { HttpRequest, Method } from "./../src/HttpRequest";

it("Should be able to construct properly", () => {
    const request = new HttpRequest("http://test.com");
    expect(request.getPath()).toEqual("http://test.com");
    expect(request.getMethod()).toEqual(Method.GET);
    expect(request.getTimeout()).toEqual(30000);
    expect(request.getBodyParams()).toEqual(null);
    expect(request.getHeaderParams()).toEqual({});
    expect(request.getQueryParams()).toEqual({});
});

it("Should be able to change the url after construct", () => {
    let request = new HttpRequest("http://test.com");
    request = request.url("http://another.url");
    expect(request.getPath()).toEqual("http://another.url");
});

it("Should be able to change the default timeout", () => {
    let request = new HttpRequest("http://test.com");
    request = request.timeout(1000);
    expect(request.getTimeout()).toEqual(1000);
});

it("Should be able to change the method to POST", () => {
    let request = new HttpRequest("http://test.com");
    request = request.post();
    expect(request.getMethod()).toEqual(Method.POST);
});

it("Should be able to change the method to PATCH", () => {
    let request = new HttpRequest("http://test.com");
    request = request.patch();
    expect(request.getMethod()).toEqual(Method.PATCH);
});

it("Should be able to change the method to PUT", () => {
    let request = new HttpRequest("http://test.com");
    request = request.put();
    expect(request.getMethod()).toEqual(Method.PUT);
});

it("Should be able to change the method to OPTIONS", () => {
    let request = new HttpRequest("http://test.com");
    request = request.options();
    expect(request.getMethod()).toEqual(Method.OPTIONS);
});

it("Should be able to change the method to DELETE", () => {
    let request = new HttpRequest("http://test.com");
    request = request.delete();
    expect(request.getMethod()).toEqual(Method.DELETE);
});

it("Should be able to change the method to GET", () => {
    let request = new HttpRequest("http://test.com");
    request = request.delete();
    request = request.get();
    expect(request.getMethod()).toEqual(Method.GET);
});

it("Should be able to add query params", () => {
    let request = new HttpRequest("http://test.com");
    request = request.query("key", "value");
    expect(request.getQueryParams()).toEqual({ key: "value" });
});

it("Should be able to add a header", () => {
    let request = new HttpRequest("http://test.com");
    request = request.header("key", "value");
    expect(request.getHeaderParams()).toEqual({ key: "value" });
});

it("Should be able to add a json headers", () => {
    let request = new HttpRequest("http://test.com");
    request = request.jsonHeaders();
    expect(request.getHeaderParams()).toEqual({ "Content-Type": "application/json" });
});

it("Should be able to add a body", () => {
    let request = new HttpRequest("http://test.com");
    request = request.body("test body");
    expect(request.getBodyParams()).toEqual("test body");
});

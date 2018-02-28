import { MocksAdapter } from "./../src/MocksAdapter";
import { HttpRequest, Method } from "./../src/HttpRequest";

test("Should be able to make a dummy request", async () => {
    const request = new HttpRequest("http://test.com");
    const adapter = new MocksAdapter(false);
    adapter.mock("test.com", Method.GET, requestParam => {
        expect(requestParam.getPath()).toEqual("http://test.com");
        return new Promise(resolve => resolve("OK"));
    });

    const response = await adapter.send(request);
    expect(response.data).toEqual("OK");
});

test("Should be able to make a dummy request out of many mocked requests", async () => {
    const request = new HttpRequest("http://test.com");
    const adapter = new MocksAdapter(false);
    adapter.mock("test.com", Method.GET, requestParam => {
        expect(requestParam.getPath()).toEqual("http://test.com");
        return new Promise(resolve => resolve("OK"));
    });

    adapter.mock("example.com", Method.GET, () => {
        return new Promise(resolve => resolve("ANOTHER TEST"));
    });

    const response = await adapter.send(request);
    expect(response.data).toEqual("OK");
});

test("Should not be able to make a request if no match is found", async () => {
    const request = new HttpRequest("http://test.com");
    const adapter = new MocksAdapter(false);

    adapter.mock("example.com", Method.GET, () => {
        return new Promise(resolve => resolve("ANOTHER TEST"));
    });

    const error = await adapter.send(request).catch(response => response);
    expect(error.data).toEqual("[MOCKS ADAPTER] No match found for http://test.com");
});

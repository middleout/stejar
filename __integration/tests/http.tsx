import { HttpRequest, HttpResponse, HttpService, Method, MocksAdapter } from "@stejar/http";

export default function() {
    const mocks = new MocksAdapter();
    const http = new HttpService(mocks);

    mocks.mock("example.json", Method.GET as any, request => Promise.resolve(new HttpResponse(200, "OK", request, "Example", {})));

    const request = new HttpRequest("http://example.com/example.json");
    http.send(request).then(response => console.log(response.data));
}

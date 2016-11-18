import {HttpRequest, Method} from "../../src/Http/Service/HttpRequest";
import {MocksAdapter} from "../../src/Http/Adapter/MocksAdapter";

describe('Mocks Adapter', () => {
    it("Should be able to make a dummy request", ( done ) => {
        const request = new HttpRequest('http://test.com');
        const adapter = new MocksAdapter();
        adapter.mock('test.com', Method.GET as any, ( request: HttpRequest ) => {
            expect(request.getPath()).toEqual('http://test.com');
            return new Promise(( resolve ) => resolve('OK'));
        });


        adapter.send(request).then(response => {
            expect(response.data).toEqual('OK');
            done();
        });
    })

    it("Should be able to make a dummy request out of many mocked requests", ( done ) => {
        const request = new HttpRequest('http://test.com');
        const adapter = new MocksAdapter();
        adapter.mock('test.com', Method.GET as any, ( request: HttpRequest ) => {
            expect(request.getPath()).toEqual('http://test.com');
            return new Promise(( resolve ) => resolve('OK'));
        });

        adapter.mock('example.com', Method.GET as any, () => {
            return new Promise(( resolve ) => resolve('ANOTHER TEST'));
        });


        adapter.send(request).then(response => {
            expect(response.data).toEqual('OK');
            done();
        });
    })

    it("Should not be able to make a request if no match is found", ( done ) => {
        const request = new HttpRequest('http://test.com');
        const adapter = new MocksAdapter();

        adapter.mock('example.com', Method.GET as any, () => {
            return new Promise(( resolve ) => resolve('ANOTHER TEST'));
        });

        adapter.send(request).catch(error => {
            expect(error.data).toEqual('[MOCKS ADAPTER] No match found for http://test.com');
            done();
        });
    })
});

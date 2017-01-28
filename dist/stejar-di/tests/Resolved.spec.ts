import {injectable} from "../src/injectable";
import {Resolver} from "../src/Resolver";
import {ServiceManager} from "../src/ServiceManager";

describe("Resolver", () => {
    it("should be able to run a function based on a class instance", () => {

        function someHandler( data: Function ) {
            return data('test');
        }

        function tester( data: string ) {
            return data;
        }

        @injectable
        class InstantiableMember {

            public tester: string = "";
            public data: string   = "";

            constructor() {
                this.tester = "Constructed";
            }

            invoke( data: string ): any {
                this.data = data;
                return data;
            }
        }

        const sm = new ServiceManager();

        expect(someHandler(tester)).toEqual("test");
        expect(someHandler(Resolver(InstantiableMember)(sm))).toEqual("test");
        expect(sm.get(InstantiableMember).data).toEqual('test');
        expect(sm.get(InstantiableMember).tester).toEqual('Constructed');
    });
});

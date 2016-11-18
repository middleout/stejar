import {namespace, getNamespacedName} from "../src/namespaceUtils";

describe('Stejar.NamespaceUtils', () => {
    it('should allow to get the name of an object namespaced', () => {

        @namespace('Package1')
        class Tester {
        }

        expect(getNamespacedName(new Tester())).toEqual('Package1/Tester');
    });
});

import { ServiceManager } from "../src/ServiceManager";
import { Tester as TesterWithValue } from "./simple-class-with-value";
import { Tester as TesterWithoutValue } from "./simple-class";
import { Tester as WithNamespaceOne } from "./class-with-namespace";
import { Tester as WithNamespaceTwo } from "./class-with-another-namespace";
import { DepTester, Tester as WithDependency } from "./class-with-dep";
import { injectable } from "../src/injectable";
import { AbstractProvider } from "../src/AbstractProvider";
const util = require('util')

describe('Stejar.ServiceManager', () => {
	it('should be able to register a new instance', () => {

		const tester         = new TesterWithValue(1);
		const serviceManager = new ServiceManager();
		serviceManager.bind(TesterWithValue, tester);

		expect(serviceManager.get(TesterWithValue)).toEqual(tester);
	});

	it('should be able to instantiate based and store the value', () => {

		const serviceManager = new ServiceManager();
		const tester         = serviceManager.get(TesterWithoutValue);

		expect(serviceManager.get(TesterWithoutValue)).toEqual(tester);
		expect(serviceManager.get(TesterWithoutValue).getVariable()).toEqual(1);
	});

	it("should be able to instantiate two different classes with different namespaces", () => {
		const serviceManager = new ServiceManager();

		expect(serviceManager.get(WithNamespaceOne)).toEqual(jasmine.any(WithNamespaceOne));
		expect(serviceManager.get(WithNamespaceTwo)).toEqual(jasmine.any(WithNamespaceTwo));
	});

	//TODO
	// it("should be able to instantiate with dependency", () => {
	// 	const serviceManager = new ServiceManager();
	//
	// 	console.log(util.inspect(WithDependency, {depth: null, colors: true}))
	// 	console.log(util.inspect(serviceManager.get(WithDependency), {depth: null, colors: true}))
	//
	// 	expect(serviceManager.get(WithDependency).dep).toEqual(jasmine.any(DepTester));
	// });
	//
	// it("should be able to bind and get a primitive value", () => {
	// 	const serviceManager = new ServiceManager();
	// 	serviceManager.bind('test', 'value');
	//
	// 	expect(serviceManager.get('test')).toEqual('value');
	// });
	//
	// it("should be able to provide a value and lazy load it", () => {
	//
	// 	@injectable
	// 	class ByProvider {
	// 		constructor( public value = 'test' ) {}
	// 	}
	//
	// 	@injectable
	// 	class RequiresProvider {
	// 		constructor( public test: ByProvider ) {}
	// 	}
	//
	// 	let tester = new ByProvider('some value');
	//
	// 	const serviceManager = new ServiceManager();
	// 	serviceManager.provide(ByProvider, () => {
	// 		return tester;
	// 	});
	//
	// 	expect(serviceManager.get(RequiresProvider).test.value).toEqual('some value');
	// 	expect(serviceManager.get(RequiresProvider).test).toEqual(tester);
	// });
	//
	// it("should not be able to get a value if no decorator", () => {
	// 	class Tester {
	// 		public constructor( public test: any ) {}
	// 	}
	//
	// 	class Tester2 {
	// 		public constructor( public test: Tester ) {}
	// 	}
	//
	// 	const serviceManager = new ServiceManager();
	//
	// 	expect(() => serviceManager.get(Tester2)).toThrowError();
	// });
	//
	// it("should not be able to get a value if the value has not been binded & the value is not a class", () => {
	//
	// 	@injectable
	// 	class Tester {
	// 		public constructor( public test: string ) {}
	// 	}
	//
	// 	const serviceManager = new ServiceManager();
	//
	// 	expect(() => serviceManager.get(Tester)).toThrowError();
	// });
	//
	// it("should not be able to get a value if the value has not been binded & the value is not a class", () => {
	//
	// 	@injectable
	// 	class Tester {
	// 		public constructor( public test: string ) {}
	// 	}
	//
	// 	const serviceManager = new ServiceManager();
	//
	// 	expect(() => serviceManager.get(Tester)).toThrowError();
	// });
	//
	// it("should not be able to get a value if it is based on an interface", () => {
	//
	// 	interface ITester {}
	//
	// 	@injectable
	// 	class Tester {
	// 		public constructor( public test: ITester ) {}
	// 	}
	//
	// 	const serviceManager = new ServiceManager();
	//
	// 	expect(() => serviceManager.get(Tester)).toThrowError();
	// });
	//
	// it("should be able to provide when having dependencies", () => {
	//
	// 	@injectable
	// 	class Dep {
	// 	}
	//
	// 	@injectable
	// 	class Tester {
	// 		public constructor( public test: Dep ) {}
	// 	}
	//
	// 	const serviceManager = new ServiceManager();
	// 	serviceManager.provide(Tester, () => new Tester(new Dep()));
	//
	// 	expect(serviceManager.get(Tester).test).toEqual(jasmine.any(Dep));
	// });
	//
	// it("should be able to provide based on provider class", () => {
	//
	// 	class Test {
	// 		constructor( public value = "test" ) {}
	// 	}
	//
	// 	class TestProvider extends AbstractProvider<Test> {
	// 		provides() { return Test; };
	//
	// 		provide( serviceManager: ServiceManager ) {
	// 			return new Test();
	// 		}
	// 	}
	//
	// 	const serviceManager = new ServiceManager();
	// 	serviceManager.provider(TestProvider);
	//
	// 	expect(serviceManager.get(Test)).toEqual(jasmine.any(Test));
	// })
});

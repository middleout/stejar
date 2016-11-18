import { Observable } from "./../../src/Utils/Observable";

describe('Stejar.Utils.Observable', () => {
	it('should be able to instantiate', () => {
		const observable = new Observable();
		expect(observable).toEqual(jasmine.any(Observable));
	});

	it('should be able to subscribe', ( done ) => {
		class A extends Observable<any> {
			test( value: any ) {
				this.onNext(value);
			}
		}

		const a = new A();
		a.subscribe(( value ) => {
			expect(value).toEqual("test");
			done();
		});

		a.test("test");
	});

	it('should be able to unsubscribe', ( done ) => {
		class A extends Observable<any> {
			test( value: any ) {
				this.onNext(value);
			}
		}

		const a     = new A();
		const unsub = a.subscribe(( value ) => {
			expect(value).not.toEqual("test");
		});
		unsub();
		a.test('test');
		setTimeout(() => done(), 100);
	});


	it('should be able to transform to an Observable', ( done ) => {
		class A extends Observable<any> {
			test( value: any ) {
				this.onNext(value);
			}
		}

		const a = new A();
		const b = a.asObservable();

		b.subscribe(( value ) => {
			expect(value).toEqual("test");
			done();
		});

		a.test('test');
	});
});

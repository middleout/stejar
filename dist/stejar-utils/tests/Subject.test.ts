import { Subject } from "./../../src/Utils/Subject";

describe('Stejar.Utils.Subject', () => {
	it('should be able to instantiate', () => {
		const subject = new Subject(true);
		expect(subject).toEqual(jasmine.any(Subject));
	});

	it('should be able to have a value', () => {
		const subject = new Subject(true);
		expect(subject.getValue()).toEqual(true);
	});

	it('should emit on subscribe', ( done ) => {
		const subject = new Subject(true);

		subject.subscribe(( value: any ) => {
			expect(value).toEqual(true);
			done();
		})
	});
});

import { Observable } from "./Observable";

export class Subject<T> extends Observable<T> {

	/**
	 * @param value
	 */
	constructor( protected value: T ) {
		super();
	}

	/**
	 * @param value
	 */
	next( value: T ): void {
		this.value = value;
		this.listeners.forEach(item => item(this.value));
	}

	/**
	 * @param callback
	 * @returns {Function}
	 */
	subscribe( callback: ( value: T )=>void ): Function {
		const unsub = super.subscribe(callback);
		this.next(this.value);
		return unsub;
	}

	/**
	 * @returns {T}
	 */
	getValue(): T {
		return this.value;
	}
}

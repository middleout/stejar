export class Observable<T> {

	/**
	 * @type {Array}
	 */
	protected listeners: Function[] = [];

	/**
	 * @param callback
	 * @returns {()=>Function[]}
	 */
	subscribe( callback: ( value: T ) => void ): Function {
		this.listeners.push(callback);
		return () => {
			const index = this.listeners.indexOf(callback);
			this.listeners.splice(index, 1);
		}
	}

	/**
	 * @param value
	 * @returns {null}
	 */
	protected onNext( value: T ): void {
		this.listeners.forEach(item => item(value));
		return null;
	}

	/**
	 * @returns {Observable}
	 */
	asObservable(): Observable<T> {
		const observable = new Observable();
		this.subscribe(value => observable.onNext(value));
		return observable;
	}
}

import { Store } from "./Store";
import { StoreAware } from "./StoreAware";

export abstract class AbstractActions<S> implements StoreAware {

	protected store: Store<S> = null;

	getState(): S {
		return this.store.getState();
	}

	/**
	 * @returns {S}
	 */
	get state(): S {
		return this.store.getState();
	}

	dispatch<P>( a: any, b?: P ) {
		return this.store.dispatch(a, b);
	}

	/**
	 * @param props
	 * @param context
	 */
	constructor() {
		var keys: any[] = [];

		if ( typeof Reflect !== 'undefined' && typeof Reflect.ownKeys === 'function' ) {
			keys = Reflect.ownKeys(this.constructor.prototype);
		} else {
			keys = Object.getOwnPropertyNames(this.constructor.prototype);
			if ( typeof Object.getOwnPropertySymbols === 'function' ) {
				keys = keys.concat(Object.getOwnPropertySymbols(this.constructor.prototype));
			}
		}

		this[ 'dispatch' ] = this.dispatch.bind(this);

		keys.forEach(( key ) => {

			// Ignore special case target method
			if ( key === 'constructor' ) {
				return;
			}

			if ( typeof this[ key ] === "function" ) {
				this[ key ] = this[ key ].bind(this);
			}
		});
	}

	/**
	 * @param store
	 */
	setStore( store: Store<any> ): void {
		this.store = store;
	}
}

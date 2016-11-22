import { StoreAware } from "./StoreAware";
import { Store } from "./Store";

export abstract class ReducerStore implements StoreAware {

	/**
	 * @type {Store}
	 */
	protected _store: Store<any>;

	/**
	 * @param store
	 */
	setStore( store: Store<any> ): void {
		this._store = store;
	}

	/**
	 * @returns {S}
	 */
	getState<S>(): S {
		return this._store.getState();
	}

	/**
	 * @type {{}}
	 */
	private bindings = {};

	/**
	 * @param name
	 * @param action
	 * @returns {ReducerStore}
	 */
	protected bind( name: string, action: Function ): this {
		if ( !name ) {
			name = '@STORE_INIT';
		}
		this.bindings[ name ] = action.bind(this);
		return this;
	}
}

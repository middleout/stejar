import { StoreAware } from "./StoreAware";
import { Store } from "./Store";

export abstract class ReducerStore<S> implements StoreAware {

	/**
	 * @type {Store}
	 */
	protected _store: Store<S>;

	/**
	 * @param store
	 */
	setStore( store: Store<S> ): void {
		this._store = store;
	}

	/**
	 * @returns {S}
	 */
	getState(): S {
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

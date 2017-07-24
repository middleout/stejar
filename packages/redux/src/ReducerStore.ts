import { Action } from "./Action";
import { Store } from "./Store";
import { StoreAware } from "./StoreAware";

export abstract class ReducerStore<S> implements StoreAware {
    /**
     * @type {Store}
     */
    protected store: Store<S>;

    /**
     * @type {{}}
     */
    private bindings = {};

    /**
     * @param store
     */
    setStore(store: Store<S>): void {
        this.store = store;
    }

    /**
     * @returns {S}
     */
    getState(): S {
        return this.store.getState();
    }

    /**
     * @param name
     * @param action
     * @returns {ReducerStore}
     */
    protected bind(name: string | null, action: { new (...args: any[]): Action<any> }): this {
        if (!name) {
            name = "@STORE_INIT";
        }
        this.bindings[name] = action.bind(this);
        return this;
    }
}

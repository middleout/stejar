import { Store } from "./Store";
import { StoreAware } from "./StoreAware";
export declare abstract class ReducerStore<S> implements StoreAware {
    /**
     * @type {{}}
     */
    bindings: {};
    /**
     * @type {Store}
     */
    protected store: Store<S>;
    /**
     * @param store
     */
    setStore(store: Store<S>): void;
    /**
     * @returns {S}
     */
    getState(): S;
    /**
     * @param name
     * @param action
     * @returns {ReducerStore}
     */
    protected bind(name: string | null, action: (...args: any[]) => S): this;
}

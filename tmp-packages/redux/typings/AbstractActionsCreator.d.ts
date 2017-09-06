import { Store } from "./Store";
import { StoreAware } from "./StoreAware";
export declare abstract class AbstractActionsCreator<S> implements StoreAware {
    /**
     * @type {Store<S>}
     */
    protected store: Store<S>;
    /**
     * @constructor
     */
    constructor();
    /**
     * @returns {S}
     */
    getState(): S;
    /**
     * @returns {S}
     */
    readonly state: S;
    /**
     * @param a
     * @param b
     */
    dispatch<P>(a: any, b?: P): any;
    /**
     * @param store
     */
    setStore(store: Store<any>): void;
}

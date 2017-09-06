import { Store } from "./Store";
export interface StoreAware {
    setStore(store: Store<any>): void;
}

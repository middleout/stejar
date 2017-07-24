import { ServiceManager } from "@stejar/di";
// import { ReducerStore } from "./ReducerStore";

// type ReducerStoreConstructor = { new (...args: any[]): ReducerStore<any> };
// type StoreCombinerDef = ReducerStoreConstructor | { [key: string]: ReducerStoreConstructor };

export function combineStores(serviceManager: ServiceManager) {
    return function storesCombiner(storesDict: any, ...stores: any[]) {
        let dict = {};
        if (typeof storesDict !== "function") {
            dict = storesDict;
        } else {
            const list = [storesDict].concat(stores);

            list.forEach(store => {
                dict[store.name] = store;
            });
        }


        const reducers = {};

        Object.keys(dict).forEach(storeName => {
            reducers[storeName] = (state: any, action: any) => {
                const instance: any = serviceManager.get(dict[storeName]);
                let actionType: string;

                if (state === undefined) {
                    actionType = "@STORE_INIT";
                }

                if (state !== undefined) {
                    actionType = action.type;
                }

                if (Object.keys(instance.bindings).includes(actionType)) {
                    return instance.bindings[actionType](state, action.payload ? action.payload : action);
                }

                return state === undefined ? {} : state;
            };
        });

        return reducers;
    };
}

import { ServiceManager } from "@stejar/di";
import { Store } from "./Store";

export function combineStores(serviceManager: ServiceManager) {
    return function storesCombiner(...stores: Array<{ new (...args: any[]): Store<any> }>) {
        const reducers = {};

        stores.forEach(store => {
            reducers[store.name] = (state: any, action: any) => {
                const instance: any = serviceManager.get(store as any);
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

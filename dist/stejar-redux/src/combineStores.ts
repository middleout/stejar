import { ServiceManager } from "@stejar/di";

export function combineStores( serviceManager: ServiceManager ) {
	return function storesCombiner( ...stores: Function[] ) {

		let reducers = {};

		stores.forEach(store => {
			reducers[ store.name ] = ( state: any, action: any ) => {

				const instance: any = serviceManager.get(store as any);
				let actionType: string;


				if ( state === undefined ) {
					actionType = '@STORE_INIT';
				} else {
					actionType = action.type;
				}

				if ( Object.keys(instance.bindings).includes(actionType) ) {
					return instance.bindings[ actionType ](state, action.payload ? action.payload : action);
				}

				return state === undefined ? {} : state;
			}
		});

		return reducers;
	}
}

import { ServiceManager } from "@stejar/di";

export function combineStores( serviceManager: ServiceManager ) {
	return function storesCombiner( ...stores: Function[] ) {

		let reducers = {};

		stores.forEach(store => {
			reducers[ store.name ] = ( state: any, action: any ) => {

				const instance: any = serviceManager.get(store as any);
				if ( Object.keys(instance.bindings).indexOf(action.type) !== -1 ) {
					console.log(instance);
					return instance.bindings[ action.type ](state, action.payload);
				}

				return {};
			}
		});

		return reducers;
	}
}

import { injectable } from "@stejar/di";
import { ReducerStore } from "@stejar/redux";
import { LoadedConfigurationAction } from "./LoadedConfigurationAction";
import { ConfigurationQueries } from "./ConfigurationQueries";

@injectable
export class ConfigurationStore<C> extends ReducerStore<{ConfigurationStore: C}> {

	/**
	 * @constructor
	 */
	constructor() {
		super();
		this.bind(LoadedConfigurationAction.name, this.loadedConfiguration)
	}

	/**
	 * @param state
	 * @param payload
	 * @returns {{}&U&AppConfig}
	 */
	protected loadedConfiguration( state: any, payload: LoadedConfigurationAction<C> ) {
		return Object.assign({}, state, payload.configuration);
	}

	/**
	 * @returns {any}
	 */
	getConfig(): C {
		return ConfigurationQueries.getConfiguration<C>(this.getState());
	}
}

import { Store } from "@stejar/redux";
import { ConfigurationLoaderContract } from "./ConfigurationLoaderContract";
import { LoadedConfigurationAction } from "./LoadedConfigurationAction";

export class ConfigurationService<C> {

	/**
	 * @param configurationLoaderContract
	 */
	constructor( protected store: Store<any>, protected configurationLoaderContract: ConfigurationLoaderContract<C> ) {}

	/**
	 * @returns {ConfigurationLoaderContract<C>}
	 */
	getLoader(): ConfigurationLoaderContract<C> {
		return this.configurationLoaderContract;
	}

	/**
	 * @returns {Promise<boolean>}
	 */
	loadConfiguration( env?: string ): Promise<boolean> {
		return this.configurationLoaderContract.loadConfiguration(env).then(data => {
			if ( !data ) {
				throw new Error("[Stejar.ConfigurationService] Could not load configuration");
			}

			this.store.dispatch(new LoadedConfigurationAction(data));

			return true;
		});
	}
}

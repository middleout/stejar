import { createSelector } from "reselect";
import { ConfigurationStore } from "./ConfigurationStore";

export class ConfigurationQueries {

	/**
	 * @type {Reselect.Selector<TInput, C>}
	 */
	static getConfiguration: <C>( state: any, props?: any ) => C = createSelector(
		state => state[ ConfigurationStore.name ],
		<C>( configuration: C ) => configuration
	);
}

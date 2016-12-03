import { createSelector, Selector } from "@stejar/reselect";
import { AuthenticationStore } from "./AuthenticationStore";

export class AuthenticationQueries {

	/**
	 * @type {Reselect.Selector<TInput, boolean>}
	 */
	static hasIdentity: Selector<any, boolean> = createSelector(
		state => state[ AuthenticationStore.name ],
		authStore => !!authStore
	);

	/**
	 * @type {Reselect.Selector<TInput, I>}
	 */
	static getIdentity: <I>( state: any, props?: any ) => I = createSelector(
		state => state[ AuthenticationStore.name ],
		<I>( identity: I ) => identity
	);
}

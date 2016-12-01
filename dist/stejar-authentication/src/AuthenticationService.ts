import { AuthenticationAdapterContract } from "./AuthenticationAdapterContract";
import { Store } from "@stejar/redux";
import { AuthenticatedAction } from "./AuthenticatedAction";
import { LoggedOutAction } from "./LoggedOutAction";
import { AuthenticationQueries } from "./AuthenticationQueries";

export class AuthenticationService<I> {

	/**
	 * @param store
	 * @param authenticationAdapter
	 */
	constructor( protected store: Store<any>, protected authenticationAdapter: AuthenticationAdapterContract<I> ) {}

	/**
	 * @returns {AuthenticationAdapterContract<I>}
	 */
	getAdapter(): AuthenticationAdapterContract<I> {
		return this.authenticationAdapter;
	}

	/**
	 * @returns {Promise<boolean>}
	 */
	refreshIdentity(): Promise<boolean> {
		return this.authenticationAdapter.refreshIdentity().then(data => {
			if ( !data ) {
				throw new Error("[Stejar.AuthenticationService] Could not Refresh Identity");
			}

			this.store.dispatch(new AuthenticatedAction(data));

			return true;
		});
	}

	/**
	 * @param data
	 * @returns {Promise<boolean>}
	 */
	authenticate<T>( data?: T ): Promise<boolean> {
		return this.authenticationAdapter
			.authenticate(data)
			.then(identity => {
				this.store.dispatch(new AuthenticatedAction(identity));
				return true;
			});
	}

	/**
	 * @returns {Promise<boolean>}
	 */
	logout(): Promise<boolean> {
		return this.authenticationAdapter.logout(AuthenticationQueries.getIdentity<I>(this.store.getState())).then(data => {
			if ( !data ) {
				throw new Error("[Stejar.AuthenticationService] Could not Logout");
			}

			this.store.dispatch(new LoggedOutAction());
			return true;
		});
	}
}

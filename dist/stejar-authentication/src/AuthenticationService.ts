import { AuthenticationAdapterContract } from "./AuthenticationAdapterContract";

export class AuthenticationService<I> {

	/**
	 * @type {I}
	 */
	private identity: I = null;

	/**
	 * @param authenticationAdapter
	 */
	constructor( protected authenticationAdapter: AuthenticationAdapterContract<I> ) {}

	/**
	 * @returns {AuthenticationAdapterContract<I>}
	 */
	getAdapter(): AuthenticationAdapterContract<I> {
		return this.authenticationAdapter;
	}

	/**
	 * @returns {boolean}
	 */
	hasIdentity(): boolean {
		return !!this.identity;
	}

	/**
	 * @returns {I}
	 */
	getIdentity(): I {
		if ( !this.identity ) {
			throw new Error('[Stejar.AuthenticationService] There is no identity registered. Do a check with "hasIdentity()" before calling this method.');
		}

		return this.identity;
	}

	/**
	 * @returns {string}
	 */
	getRole(): string {
		if ( !this.identity ) {
			throw new Error('[Stejar.AuthenticationService] There is no identity registered. Do a check with "hasIdentity()" before calling this method.');
		}

		return this.authenticationAdapter.getRole(this.identity);
	}

	/**
	 * @returns {Promise<boolean>}
	 */
	refreshIdentity(): Promise<boolean> {
		return this.authenticationAdapter.refreshIdentity().then(data => {
			if ( !data ) {
				throw new Error("[Stejar.AuthenticationService] Could not Refresh Identity");
			}

			this.identity = data;

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
				this.identity = identity;
				return true;
			});
	}

	/**
	 * @returns {Promise<boolean>}
	 */
	logout(): Promise<boolean> {
		return this.authenticationAdapter.logout().then(data => {
			if ( !data ) {
				throw new Error("[Stejar.AuthenticationService] Could not Logout");
			}

			this.identity = null;
			return true;
		});
	}
}

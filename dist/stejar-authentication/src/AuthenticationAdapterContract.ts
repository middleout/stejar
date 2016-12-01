export interface AuthenticationAdapterContract<I> {

	/**
	 * @returns {Promise<I>}
	 */
	refreshIdentity(): Promise<I>;

	/**
	 * @param data
	 */
	authenticate<T>( data: T ): Promise<I>;

	/**
	 * @param data
	 */
	logout(identity: I): Promise<boolean>;
}

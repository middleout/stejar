export interface ConfigurationLoaderContract<C> {

	/**
	 * @returns {Promise<I>}
	 */
	loadConfiguration( environment?: string ): Promise<C>;
}

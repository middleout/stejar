export interface TranslatorAdapterContract {

	/**
	 * @param code
	 */
	load( code: string ): Promise<{[key: string]: string}>;
}

export interface RoutingAdapterContract {

	/**
	 * @param callback
	 */
	start( callback: ( path: string, query: Object ) => void ): Function;

	/**
	 * @param url
	 */
	navigate( url: string ): void;
}

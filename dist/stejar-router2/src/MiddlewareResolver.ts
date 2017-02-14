export interface MiddlewareResolver {

	/**
	 * @param middleware
	 */
	( middleware: any ): ( fromState: any ) => any;
}

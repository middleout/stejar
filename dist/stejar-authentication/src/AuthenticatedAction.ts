export class AuthenticatedAction<I> {

	/**
	 * @param identity
	 */
	constructor( public identity: I ) {}
}

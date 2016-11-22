export class LoadedLocaleAction {

	/**
	 * @param locale
	 * @param catalog
	 */
	constructor( public locale: string, public catalog: {[label: string]: string} ) {}
}

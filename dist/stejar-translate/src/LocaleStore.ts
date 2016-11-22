import { injectable } from "@stejar/di";
import { ReducerStore } from "@stejar/redux";
import { LoadedLocaleAction } from "./LoadedLocaleAction";
import { ChangedLocaleAction } from "./ChangedLocaleAction";
import { LocaleQueries } from "./LocaleQueries";

export interface LocaleStoreState {
	catalogs: {[locale: string]: {[label: string]: string}};
	currentLocale: string;
}

@injectable
export class LocaleStore extends ReducerStore {

	/**
	 * @constructor
	 */
	constructor() {
		super();
		this.bind(null, () => (
			{
				catalogs     : {},
				currentLocale: null as string,
			}
		) as LocaleStoreState);
		this.bind(LoadedLocaleAction.name, this.loadedLocale);
		this.bind(ChangedLocaleAction.name, this.changedLocale);
	}

	/**
	 * @param state
	 * @param payload
	 * @returns {{}&U&AppConfig}
	 */
	protected loadedLocale( state: LocaleStoreState, payload: LoadedLocaleAction ) {
		return Object.assign({}, state, {
			catalogs: Object.assign({}, state.catalogs || {}, {
				[payload.locale]: payload.catalog
			})
		});
	}

	/**
	 * @param state
	 * @param payload
	 * @returns {{}&U&AppConfig}
	 */
	protected changedLocale( state: LocaleStoreState, payload: ChangedLocaleAction ) {
		return Object.assign({}, state, {
			currentLocale: payload.locale
		});
	}

	/**
	 * @returns {string}
	 */
	getCurrentLocale(): string {
		return LocaleQueries.getCurrentLocale(this.getState<{LocaleStore: LocaleStoreState}>());
	}
}

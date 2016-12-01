import { createSelector, Selector } from "reselect";
import { LocaleStore, LocaleStoreState } from "./LocaleStore";

export class LocaleQueries {

	/**
	 * @type {Reselect.Selector<TInput, string>}
	 */
	static getCurrentLocale: Selector<{LocaleStore: LocaleStoreState}, string> = createSelector(
		state => state[ LocaleStore.name ],
		( store: LocaleStoreState ) => store.currentLocale
	);

	/**
	 * @type {Reselect.Selector<TInput, string>}
	 */
	static hasLocaleBeenLoaded: Selector<{LocaleStore: LocaleStoreState}, boolean> = createSelector(
		state => state[ LocaleStore.name ],
		( state: any, props: {locale: string} ) => props.locale,
		( store: LocaleStoreState, locale: string ) => Object.keys(store.catalogs).includes(locale)
	);

	/**
	 * @type {Reselect.Selector<TInput, string>}
	 */
	static getLocaleCatalog: Selector<{LocaleStore: LocaleStoreState}, {[key: string]: string}> = createSelector(
		state => state[ LocaleStore.name ],
		( state: any, props: {locale: string} ) => props.locale,
		( store: LocaleStoreState, locale: string ) => store.catalogs[ locale ]
	);

	/**
	 * @type {Reselect.Selector<TInput, string>}
	 */
	static getLocaleCatalogs: Selector<{LocaleStore: LocaleStoreState}, {[key: string]: {[key: string]: string}}> = createSelector(
		state => state[ LocaleStore.name ],
		( store: LocaleStoreState ) => store.catalogs
	);

}

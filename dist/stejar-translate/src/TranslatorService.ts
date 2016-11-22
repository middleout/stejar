import { injectable } from "@stejar/di";
import moment, { LocaleSpecification } from "moment";
import numbro from "numbro";
import { Store } from "@stejar/redux";
import { TranslatorAdapterContract } from "./TranslatorAdapterContract";
import { LocaleQueries } from "./LocaleQueries";
import { LoadedLocaleAction } from "./LoadedLocaleAction";
import { ChangedLocaleAction } from "./ChangedLocaleAction";

@injectable
export class TranslatorService {

	/**
	 * @type {boolean}
	 */
	protected debug: boolean = false;

	/**
	 * @param store
	 * @param adapter
	 */
	constructor( protected store: Store<any>, protected adapter: TranslatorAdapterContract ) {}

	/**
	 * @returns {void}
	 */
	enableDebug(): void {
		this.debug = true;
		console.log('[Stejar-Translate][TranslatorService] - Debug enabled');
	}

	/**
	 * @returns {void}
	 */
	disableDebug(): void {
		this.debug = false;
	}

	/**
	 * @param localeCode
	 * @returns {boolean}
	 */
	isLocaleLoaded( localeCode: string ): boolean {
		return LocaleQueries.hasLocaleBeenLoaded(this.store.getState(), {locale: localeCode});
	}

	/**
	 * @param localeCode
	 * @param config
	 * @returns {TranslatorService}
	 */
	registerNumbersLocale( localeCode: string, config: any ): this {
		numbro.language(localeCode, config);
		if ( this.debug ) {
			console.log(`[Stejar-Translate][TranslatorService] - Registered Numbers Locale: ${localeCode}`);
		}
		return this;
	}

	/**
	 * @param localeCode
	 * @param config
	 * @returns {TranslatorService}
	 */
	registerDateLocale( localeCode: string, config?: LocaleSpecification ): this {
		moment.locale(localeCode, config);
		if ( this.debug ) {
			console.log(`[Stejar-Translate][TranslatorService] - Registered Date Locale: ${localeCode}`);
		}
		return this;
	}

	/**
	 * @param localeCode
	 */
	changeLocale( localeCode: string ): void {
		if ( !this.isLocaleLoaded(localeCode) ) {
			throw new Error(`Locale "${localeCode}" has not been loaded`);
		}

		this.store.dispatch(new ChangedLocaleAction(localeCode));
		let momentLocale = localeCode.split('-')[ 0 ];
		(moment as any).locale(momentLocale);
		(numbro as any).culture(localeCode);
		if ( this.debug ) {
			console.log(`[Stejar-Translate][TranslatorService] - Changed locale to ${localeCode}`);
		}
	}

	/**
	 * @param localeCode
	 * @returns {Promise<TResult>}
	 */
	loadLocale( localeCode: string ): Promise<void> {
		return this.adapter.load(localeCode).then(catalog => {
			this.store.dispatch(new LoadedLocaleAction(localeCode, catalog));
			if ( this.debug ) {
				console.log(`[Stejar-Translate][TranslatorService] - Loaded locale: ${localeCode}`);
			}
		});
	}

	/**
	 * @param label
	 * @returns {string}
	 */
	translate( label: string ): string {

		const activeLocale = LocaleQueries.getCurrentLocale(this.store.getState());

		if ( !activeLocale ) {
			throw new Error(`[Stejar-Translate][TranslatorService] There is no active locale to fallback to.`);
		}

		const catalog = LocaleQueries.getLocaleCatalog(this.store.getState(), {locale: activeLocale});
		if ( !catalog[ label ] ) {
			if ( this.debug ) {
				console.warn(`[Stejar-Translate][TranslatorService] Label "${label}" does not exist`);
			}
			return label;
		}

		return catalog[ label ];
	}
}

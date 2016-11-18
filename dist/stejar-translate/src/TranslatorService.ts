import { injectable } from "@stejar/di";
import moment, { LocaleSpecification } from "moment";
import numbro from "numbro";
import { Observable, Subject } from "@stejar/utils";
import { TranslatorAdapterContract } from "./TranslatorAdapterContract";

@injectable
export class TranslatorService {

	/**
	 * @type {Array}
	 */
	protected loadedLocales: string[] = [];

	/**
	 * @type {any}
	 */
	protected activeLocale: string = null;

	/**
	 * @type {boolean}
	 */
	protected debug: boolean = false;

	/**
	 * @type {{}}
	 */
	protected catalogs: {[code: string]: {[label: string]: string}} = {};

	/**
	 * @type {Subject}
	 */
	protected _activeLocale$: Subject<string> = new Subject(null);

	/**
	 * @type {Subject}
	 */
	protected _loadedLocales$: Subject<string[]> = new Subject([]);

	/**
	 * @type {Observable}
	 */
	activeLocale$: Observable<string> = this._activeLocale$.asObservable();

	/**
	 * @type {Observable}
	 */
	loadedLocales$: Observable<string[]> = this._loadedLocales$.asObservable();


	/**
	 * @param adapter
	 */
	constructor( protected adapter: TranslatorAdapterContract ) {}

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
		return this.loadedLocales.indexOf(localeCode) !== -1;
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
		this.activeLocale = localeCode;
		let momentLocale  = localeCode.split('-')[ 0 ];
		(moment as any).locale(momentLocale);
		(numbro as any).culture(localeCode);
		if ( this.debug ) {
			console.log(`[Stejar-Translate][TranslatorService] - Changed locale to ${localeCode}`);
		}
		this._activeLocale$.emit(localeCode);
	}

	/**
	 * @returns {string}
	 */
	getCurrentLocale(): string {
		return this.activeLocale;
	}

	/**
	 * @param localeCode
	 * @returns {Promise<TResult>}
	 */
	loadLocale( localeCode: string ): Promise<void> {
		return this.adapter.load(localeCode).then(catalog => {
			this.catalogs[ localeCode ] = catalog;
			if ( !this.isLocaleLoaded(localeCode) ) {
				this.loadedLocales.push(localeCode);
			}
			if ( this.debug ) {
				console.log(`[Stejar-Translate][TranslatorService] - Loaded locale: ${localeCode}`);
			}
			this._loadedLocales$.emit(this.loadedLocales);
		});
	}

	/**
	 * @param label
	 * @returns {string}
	 */
	translate( label: string ): string {
		if ( !this.activeLocale ) {
			throw new Error(`[Stejar-Translate][TranslatorService] There is no active locale to fallback to.`);
		}

		const locale = this.activeLocale;

		const catalog = this.catalogs[ locale ];
		if ( !catalog[ label ] ) {
			if ( this.debug ) {
				console.warn(`[Stejar-Translate][TranslatorService] Label "${label}" does not exist`);
			}
			return label;
		}

		return catalog[ label ];
	}
}

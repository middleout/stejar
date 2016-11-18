// Generated by dts-bundle v0.6.1
// Dependencies for this module:
//   ../moment
//   ../@stejar/utils
//   ../react
//   ../@stejar/react

import { LocaleSpecification } from "moment";
import { Observable, Subject } from "@stejar/utils";
import { HTMLAttributes } from "react";
import { PureComponent } from "@stejar/react";

export interface TranslatorAdapterContract {
    /**
      * @param code
      */
    load(code: string): Promise<{
        [key: string]: string;
    }>;
}

export class TranslatorService {
        protected adapter: TranslatorAdapterContract;
        /**
            * @type {Array}
            */
        protected loadedLocales: string[];
        /**
            * @type {any}
            */
        protected activeLocale: string;
        /**
            * @type {boolean}
            */
        protected debug: boolean;
        /**
            * @type {{}}
            */
        protected catalogs: {
                [code: string]: {
                        [label: string]: string;
                };
        };
        /**
            * @type {Subject}
            */
        protected _activeLocale$: Subject<string>;
        /**
            * @type {Subject}
            */
        protected _loadedLocales$: Subject<string[]>;
        /**
            * @type {Observable}
            */
        activeLocale$: Observable<string>;
        /**
            * @type {Observable}
            */
        loadedLocales$: Observable<string[]>;
        /**
            * @param adapter
            */
        constructor(adapter: TranslatorAdapterContract);
        /**
            * @returns {void}
            */
        enableDebug(): void;
        /**
            * @returns {void}
            */
        disableDebug(): void;
        /**
            * @param localeCode
            * @returns {boolean}
            */
        isLocaleLoaded(localeCode: string): boolean;
        /**
            * @param localeCode
            * @param config
            * @returns {TranslatorService}
            */
        registerNumbersLocale(localeCode: string, config: any): this;
        /**
            * @param localeCode
            * @param config
            * @returns {TranslatorService}
            */
        registerDateLocale(localeCode: string, config?: LocaleSpecification): this;
        /**
            * @param localeCode
            */
        changeLocale(localeCode: string): void;
        /**
            * @returns {string}
            */
        getCurrentLocale(): string;
        /**
            * @param localeCode
            * @returns {Promise<TResult>}
            */
        loadLocale(localeCode: string): Promise<void>;
        /**
            * @param label
            * @returns {string}
            */
        translate(label: string): string;
}

export interface TranslateProps extends HTMLAttributes<any> {
        [key: string]: any;
        [key: number]: any;
        translatorService?: TranslatorService;
}
export class Translate extends PureComponent<TranslateProps, {}> {
        /**
            * @type {Function}
            */
        protected unsubscribe: Function;
        /**
            * @returns {JSX.Element}
            */
        render(): JSX.Element;
        /**
            * @returns {null}
            */
        componentDidMount(): void;
        /**
            * @returns {null}
            */
        componentWillUnmount(): void;
}

export interface LocalizedTitleProps extends HTMLAttributes<any> {
    [key: string]: any;
    [key: number]: any;
    translatorService?: TranslatorService;
}
export class LocalizedTitle extends PureComponent<LocalizedTitleProps, {}> {
    /**
      * @returns {JSX.Element}
      */
    render(): JSX.Element;
}


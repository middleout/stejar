import { sprintf } from "sprintf-js";

export function IntlService(intlAdapter, intlStorageAdapter) {
    const getCurrentLocale = locale => intlStorageAdapter.getCurrentLocale(locale);
    const isLocaleCodeValid = locale => intlAdapter.isValid(locale);

    return {
        enableShowMissingTranslations() {
            intlStorageAdapter.enableShowMissingTranslations();
        },
        disableShowMissingTranslations() {
            intlStorageAdapter.disableShowMissingTranslations();
        },
        isLocaleCodeValid,
        loadLocale(locale, force = false) {
            if (!isLocaleCodeValid(locale)) {
                throw new Error(`"${locale}" is an invalid locale`);
            }

            if (!force && intlStorageAdapter.hasCatalogForLocale(locale)) {
                return intlStorageAdapter.getCatalog(locale);
            }

            return intlAdapter.load(locale).then(catalog => {
                intlStorageAdapter.setCatalog(locale, catalog);
                return catalog;
            });
        },
        changeLocale(locale) {
            if (!intlStorageAdapter.hasCatalogForLocale(locale)) {
                throw new Error(
                    `Cannot change locale to "${locale} since the catalog for this code has not been loaded yet. Did you forget to call "intlService.loadLocale(${locale}" ?`
                );
            }

            intlStorageAdapter.setCurrentLocale(locale);
            return true;
        },
        getCurrentLocale,
        translate(key, ...args) {
            const catalog = intlStorageAdapter.getCatalog(getCurrentLocale());

            if (!catalog[key]) {
                if (intlStorageAdapter.showMissingTranslations()) {
                    return "*" + key + "*";
                }

                return key;
            }

            const translated = catalog[key];
            return sprintf(translated, ...args);
        },
    };
}

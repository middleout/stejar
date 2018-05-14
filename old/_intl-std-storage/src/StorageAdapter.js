export function StorageAdapter() {
    let showMissingTranslations = false;
    let currentLocale = null;
    let catalogs = {};

    const hasCatalogForLocale = locale => !!catalogs[locale] || false;

    return {
        hasCatalogForLocale,
        getCatalog(locale) {
            if (!hasCatalogForLocale(locale)) {
                throw new Error(`Cannot get catalog for locale "${locale}" since it has not been loaded yet`);
            }

            return catalogs[locale];
        },
        setCatalog(locale, catalog) {
            catalogs[locale] = catalog;
            return true;
        },
        setCurrentLocale(locale) {
            if (!hasCatalogForLocale(locale)) {
                throw new Error(
                    `Cannot change current locale to "${locale}" since it's catalog has not been loaded yet`
                );
            }
            currentLocale = locale;
            return true;
        },
        getCurrentLocale() {
            return currentLocale;
        },
        enableShowMissingTranslations() {
            showMissingTranslations = true;
            return true;
        },
        disableShowMissingTranslations() {
            showMissingTranslations = false;
            return true;
        },
        showMissingTranslations() {
            return showMissingTranslations;
        },
    };
}

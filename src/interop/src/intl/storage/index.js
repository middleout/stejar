const methods = [
    "hasCatalogForLocale",
    "getCatalog",
    "setCatalog",
    "setCurrentLocale",
    "getCurrentLocale",
    "enableShowMissingTranslations",
    "disableShowMissingTranslations",
    "showMissingTranslations",
];

export function ensureInterop(adapter) {
    methods.forEach(method => {
        if (typeof adapter[method] !== "function") {
            throw new Error(`The Storage adapter does not implement the "${method}" method.`);
        }
    });

    return adapter;
}

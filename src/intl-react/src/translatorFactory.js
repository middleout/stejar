let prevCatalog = null;
let prevDebug = null;
let prevTranslator = null;

export function translatorFactory(catalog, debug) {
    if (catalog === prevCatalog && debug === prevDebug) {
        return prevTranslator;
    }

    prevCatalog = catalog;
    prevDebug = debug;

    return (prevTranslator = function translator(key, namedArgs = {}) {
        let translated = catalog[key] ? catalog[key] : key;
        if (debug) {
            translated = "*" + translated + "*";
        }

        Object.keys(namedArgs).forEach(paramName => {
            if (typeof namedArgs[paramName] === "object") {
                return;
            }

            translated = translated.replace(":" + paramName, namedArgs[paramName]);
        });

        return translated;
    });
}

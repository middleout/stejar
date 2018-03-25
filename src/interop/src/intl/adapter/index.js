const methods = ["load", "isValid"];

export function ensureInterop(adapter) {
    methods.forEach(method => {
        if (typeof adapter[method] !== "function") {
            throw new Error(`The Intl loading adapter does not implement the "${method}" method.`);
        }
    });

    return adapter;
}

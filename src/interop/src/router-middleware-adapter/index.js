const methods = ["getPreviousMatch", "update", "hydrate"];

export function ensureInterop(adapter) {
    methods.forEach(method => {
        if (typeof adapter[method] !== "function") {
            throw new Error(`The router middleware adapter does not implement the "${method}" method.`);
        }
    });

    return adapter;
}

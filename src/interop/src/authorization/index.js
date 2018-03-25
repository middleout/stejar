const methods = ["addResource", "addRole", "getResources", "getRoles", "getRules", "addRule", "removeRule"];

export function ensureInterop(adapter) {
    methods.forEach(method => {
        if (typeof adapter[method] !== "function") {
            throw new Error(`The authorization adapter does not implement the "${method}" method.`);
        }
    });

    return adapter;
}

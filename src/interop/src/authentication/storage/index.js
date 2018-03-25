const methods = ["getIdentity", "setIdentity", "clearIdentity"];

export function ensureInterop(storageAdapter) {
    methods.forEach(method => {
        if (typeof storageAdapter[method] !== "function") {
            throw new Error(`The authentication storage adapter does not implement the "${method}" method.`);
        }
    });

    return storageAdapter;
}

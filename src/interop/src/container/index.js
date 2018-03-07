const methods = ["get", "has"];

export function ensureInterop(container) {
    methods.forEach(method => {
        if (typeof container[method] !== "function") {
            throw new Error(`The container does not implement the "${method}" method.`);
        }
    });

    return container;
}

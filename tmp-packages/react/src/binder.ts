export function binder<T>(object: T): T {
    let keys: any[] = [];

    if (typeof Reflect !== "undefined" && typeof Reflect.ownKeys === "function") {
        keys = Reflect.ownKeys(object.constructor.prototype);
    } else {
        keys = Object.getOwnPropertyNames(object.constructor.prototype);
        if (typeof Object.getOwnPropertySymbols === "function") {
            keys = keys.concat(Object.getOwnPropertySymbols(object.constructor.prototype));
        }
    }

    keys.forEach(key => {
        // Ignore special case target method
        if (key === "constructor") {
            return;
        }

        if (typeof object[key] === "function") {
            object[key] = object[key].bind(object);
        }
    });

    return object;
}

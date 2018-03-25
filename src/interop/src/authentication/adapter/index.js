const methods = ["getIdentityFromToken", "login", "logout"];

export function ensureInterop(authAdapter) {
    methods.forEach(method => {
        if (typeof authAdapter[method] !== "function") {
            throw new Error(`The authentication adapter does not implement the "${method}" method.`);
        }
    });

    return authAdapter;
}

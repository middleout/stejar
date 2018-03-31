export function StorageAdapter() {
    let storedIdentity = null;

    return {


        setIdentity(identity) {
            storedIdentity = identity;
            return true;
        },
        getIdentity() {
            return storedIdentity;
        },
        clearIdentity() {
            storedIdentity = null;
            return true;
        },
    };
}

import { ensureAuthenticationAdapterInterop, ensureAuthenticationStorageInterop } from "@stejar/interop";

export function authenticationService(authAdapter, storageAdapter) {
    ensureAuthenticationAdapterInterop(authAdapter);
    ensureAuthenticationStorageInterop(storageAdapter);

    return {
        hasIdentity() {
            return !!storageAdapter.getIdentity();
        },
        getIdentity() {
            return storageAdapter.getIdentity();
        },
        setIdentity(identity) {
            storageAdapter.setIdentity(identity);
            return identity;
        },
        clearIdentity(...data) {
            storageAdapter.clearIdentity(...data);
            return true;
        },
        async setIdentityFromToken(token) {
            const identity = await authAdapter.getIdentityFromToken(token);
            storageAdapter.setIdentity(identity);
            return identity;
        },
        async login(...data) {
            const identity = await authAdapter.login(...data);
            storageAdapter.setIdentity(identity);
            return identity;
        },
        async logout(...data) {
            await authAdapter.logout(...data, storageAdapter.getIdentity());
            storageAdapter.clearIdentity(...data);
            return true;
        },
    };
}

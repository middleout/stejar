export function AuthenticationService(authAdapter, storageAdapter) {
    return {
        hello() {
            return "world35";
        },
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
        setIdentityFromToken(token) {
            return authAdapter.getIdentityFromToken(token).then(identity => {
                storageAdapter.setIdentity(identity);
                return identity;
            });
        },
        login(...data) {
            return authAdapter.login(...data).then(identity => {
                storageAdapter.setIdentity(identity);
                return identity;
            });
        },
        logout(...data) {
            return authAdapter.logout(...data, storageAdapter.getIdentity()).then(() => {
                storageAdapter.clearIdentity(...data);
                return true;
            });
        },
    };
}

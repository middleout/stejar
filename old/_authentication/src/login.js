export const login = (authAdapter, storageAdapter, ...data) => {
    return authAdapter.login(...data).then(identity => {
        storageAdapter.setIdentity(identity);
        return identity;
    });
};

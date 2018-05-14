export const logout = (authAdapter, storageAdapter, ...data) => {
    return authAdapter.logout(...data, storageAdapter.getIdentity()).then(() => {
        storageAdapter.clearIdentity(...data);
        return true;
    });
};

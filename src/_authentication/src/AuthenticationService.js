import { getIdentity } from "./getIdentity";
import { hasIdentity } from "./hasIdentity";
import { setIdentity } from "./setIdentity";
import { clearIdentity } from "./clearIdentity";
import { login } from "./login";
import { logout } from "./logout";

export function AuthenticationService(authAdapter, storageAdapter) {
    return {
        hasIdentity: () => hasIdentity(storageAdapter),
        getIdentity: () => getIdentity(storageAdapter),
        setIdentity: identity => setIdentity(storageAdapter, identity),
        clearIdentity: () => clearIdentity(storageAdapter),
        login: (...data) => login(authAdapter, storageAdapter, ...data),
        logout: (...data) => logout(authAdapter, storageAdapter, ...data),
    };
}

import { getCurrentLocaleCatalog } from "../../selectors";

export function translator(store) {
    return str => {
        return getCurrentLocaleCatalog(store.getState())[str] || str;
    };
}

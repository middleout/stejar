import { changeLocale, loadedCatalog, loadingCatalog } from "@stejar/intl/es/actions";
import { reducer as intlReducer } from "@stejar/intl/es/reducer";
import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { changeReplacer, defaultReplacer } from "../src";

export function bootStore(catalog) {
    const store = createStore(
        combineReducers({
            "@stejar/intl": intlReducer,
        }),
        applyMiddleware(thunk)
    );

    store.dispatch(loadingCatalog("en-GB"));
    store.dispatch(loadedCatalog("en-GB", catalog));
    store.dispatch(changeLocale("en-GB"));

    return store;
}

export function bootErrorHandler(originalConsoleError) {
    changeReplacer(defaultReplacer);

    console.error = jest.fn(msg => {
        if (msg.includes("Warning: useLayoutEffect does nothing on the server")) {
            return null;
        } else {
            originalConsoleError(msg);
        }
    });
}

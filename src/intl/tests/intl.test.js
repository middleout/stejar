import { createStore, combineReducers, applyMiddleware } from "redux";
import createThunkMiddleware from "redux-thunk";
import { changeStateSelector } from "../src/settings";
import { reducer as intlReducer } from "../src/reducer";
import {
    $getCatalogs,
    $getCurrentCatalog,
    $getCurrentLocale,
    $isDebugEnabled,
    $getIsLoading,
    $getLastKnownError,
} from "../src/selectors";

import {
    loadingCatalog,
    loadedCatalog,
    changeLocale,
    failedToLoadCatalog,
    disableDebug,
    enableDebug,
} from "../src/actions";

function createAppStore(name) {
    const appReducer = combineReducers({
        [name]: intlReducer,
    });
    return createStore(appReducer, applyMiddleware(createThunkMiddleware));
}

describe("@stejar", () => {
    describe("intl", () => {
        beforeEach(() => {});

        describe("with default module name", () => {
            test("default state", () => {
                const name = "@stejar/intl";
                const store = createAppStore(name);
                expect(store.getState()).toEqual({
                    [name]: {
                        isLoading: {},
                        catalogs: {},
                        currentLocale: null,
                        lastKnownError: null,
                        debug: false,
                    },
                });

                expect($getCatalogs(store.getState())).toEqual({});
                expect($getCurrentCatalog(store.getState())).toEqual(undefined);
                expect($getCurrentLocale(store.getState())).toEqual(null);
                expect($isDebugEnabled(store.getState())).toEqual(false);
                expect($getLastKnownError(store.getState())).toEqual(null);
                expect($getIsLoading(store.getState(), { locale: "en-GB" })).toEqual(false);
            });

            test("loading locale", () => {
                const name = "@stejar/intl";
                const store = createAppStore(name);
                store.dispatch(loadingCatalog("en-GB"));

                expect(store.getState()).toEqual({
                    [name]: {
                        isLoading: {
                            "en-GB": true,
                        },
                        catalogs: {},
                        currentLocale: null,
                        lastKnownError: null,
                        debug: false,
                    },
                });

                expect($getCatalogs(store.getState())).toEqual({});
                expect($getCurrentCatalog(store.getState())).toEqual(undefined);
                expect($getCurrentLocale(store.getState())).toEqual(null);
                expect($isDebugEnabled(store.getState())).toEqual(false);
                expect($getLastKnownError(store.getState())).toEqual(null);
                expect($getIsLoading(store.getState(), { locale: "en-GB" })).toEqual(true);
                expect($getIsLoading(store.getState(), { locale: "ro-RO" })).toEqual(false);
            });

            test("failed to load locale", () => {
                const name = "@stejar/intl";
                const store = createAppStore(name);
                store.dispatch(loadingCatalog("en-GB"));
                store.dispatch(failedToLoadCatalog("en-GB", "foo error"));

                expect(store.getState()).toEqual({
                    [name]: {
                        isLoading: {
                            "en-GB": false,
                        },
                        catalogs: {},
                        currentLocale: null,
                        lastKnownError: "foo error",
                        debug: false,
                    },
                });

                expect($getCatalogs(store.getState())).toEqual({});
                expect($getCurrentCatalog(store.getState())).toEqual(undefined);
                expect($getCurrentLocale(store.getState())).toEqual(null);
                expect($isDebugEnabled(store.getState())).toEqual(false);
                expect($getLastKnownError(store.getState())).toEqual("foo error");
                expect($getIsLoading(store.getState(), { locale: "en-GB" })).toEqual(false);
            });

            test("loaded locale", () => {
                const name = "@stejar/intl";
                const store = createAppStore(name);
                store.dispatch(loadingCatalog("en-GB"));
                store.dispatch(loadedCatalog("en-GB", { key: "en-value" }));

                expect(store.getState()).toEqual({
                    [name]: {
                        isLoading: {
                            "en-GB": false,
                        },
                        catalogs: {
                            "en-GB": { key: "en-value" },
                        },
                        currentLocale: null,
                        lastKnownError: null,
                        debug: false,
                    },
                });

                expect($getCatalogs(store.getState())).toEqual({
                    "en-GB": { key: "en-value" },
                });
                expect($getCurrentCatalog(store.getState())).toEqual(undefined);
                expect($getCurrentLocale(store.getState())).toEqual(null);
                expect($isDebugEnabled(store.getState())).toEqual(false);
                expect($getLastKnownError(store.getState())).toEqual(null);
                expect($getIsLoading(store.getState(), { locale: "en-GB" })).toEqual(false);
            });

            test("loaded locale after failure", () => {
                const name = "@stejar/intl";
                const store = createAppStore(name);
                store.dispatch(loadingCatalog("en-GB"));
                store.dispatch(failedToLoadCatalog("en-GB", "foo error"));
                store.dispatch(loadingCatalog("en-GB"));
                store.dispatch(loadedCatalog("en-GB", { key: "en-value" }));

                expect(store.getState()).toEqual({
                    [name]: {
                        isLoading: {
                            "en-GB": false,
                        },
                        catalogs: {
                            "en-GB": { key: "en-value" },
                        },
                        currentLocale: null,
                        lastKnownError: null,
                        debug: false,
                    },
                });

                expect($getCatalogs(store.getState())).toEqual({
                    "en-GB": { key: "en-value" },
                });
                expect($getCurrentCatalog(store.getState())).toEqual(undefined);
                expect($getCurrentLocale(store.getState())).toEqual(null);
                expect($isDebugEnabled(store.getState())).toEqual(false);
                expect($getLastKnownError(store.getState())).toEqual(null);
                expect($getIsLoading(store.getState(), { locale: "en-GB" })).toEqual(false);
            });

            test("change locale", () => {
                const name = "@stejar/intl";
                const store = createAppStore(name);
                store.dispatch(loadingCatalog("en-GB"));
                store.dispatch(loadedCatalog("en-GB", { key: "en-value" }));
                store.dispatch(changeLocale("en-GB"));

                expect(store.getState()).toEqual({
                    [name]: {
                        isLoading: {
                            "en-GB": false,
                        },
                        catalogs: {
                            "en-GB": { key: "en-value" },
                        },
                        currentLocale: "en-GB",
                        lastKnownError: null,
                        debug: false,
                    },
                });

                expect($getCatalogs(store.getState())).toEqual({
                    "en-GB": { key: "en-value" },
                });
                expect($getCurrentCatalog(store.getState())).toEqual({ key: "en-value" });
                expect($getCurrentLocale(store.getState())).toEqual("en-GB");
                expect($isDebugEnabled(store.getState())).toEqual(false);
                expect($getLastKnownError(store.getState())).toEqual(null);
                expect($getIsLoading(store.getState(), { locale: "en-GB" })).toEqual(false);
            });

            test("enable debug", () => {
                const name = "@stejar/intl";
                const store = createAppStore(name);
                store.dispatch(enableDebug());

                expect(store.getState()).toEqual({
                    [name]: {
                        isLoading: {},
                        catalogs: {},
                        currentLocale: null,
                        lastKnownError: null,
                        debug: true,
                    },
                });

                expect($isDebugEnabled(store.getState())).toEqual(true);
            });

            test("disable debug", () => {
                const name = "@stejar/intl";
                const store = createAppStore(name);
                store.dispatch(disableDebug());

                expect(store.getState()).toEqual({
                    [name]: {
                        isLoading: {},
                        catalogs: {},
                        currentLocale: null,
                        lastKnownError: null,
                        debug: false,
                    },
                });
                expect($isDebugEnabled(store.getState())).toEqual(false);
            });

            test("disable debug after enabled", () => {
                const name = "@stejar/intl";
                const store = createAppStore(name);
                store.dispatch(enableDebug());
                store.dispatch(disableDebug());

                expect(store.getState()).toEqual({
                    [name]: {
                        isLoading: {},
                        catalogs: {},
                        currentLocale: null,
                        lastKnownError: null,
                        debug: false,
                    },
                });
                expect($isDebugEnabled(store.getState())).toEqual(false);
            });
        });

        describe("with custom module name", () => {
            test("default state - root module name", () => {
                const name = "some-path";
                changeStateSelector(state => state["some-path"]);
                const store = createAppStore(name);
                expect(store.getState()).toEqual({
                    [name]: {
                        isLoading: {},
                        catalogs: {},
                        currentLocale: null,
                        lastKnownError: null,
                        debug: false,
                    },
                });

                expect($getCatalogs(store.getState())).toEqual({});
                expect($getCurrentCatalog(store.getState())).toEqual(undefined);
                expect($getCurrentLocale(store.getState())).toEqual(null);
                expect($isDebugEnabled(store.getState())).toEqual(false);
                expect($getLastKnownError(store.getState())).toEqual(null);
                expect($getIsLoading(store.getState(), { locale: "en-GB" })).toEqual(false);
            });

            test("default state - nested module name", () => {
                changeStateSelector(state => state.some.path);
                const appReducer = combineReducers({
                    some: combineReducers({
                        path: intlReducer,
                    }),
                });
                const store = createStore(appReducer, applyMiddleware(createThunkMiddleware));
                expect(store.getState()).toEqual({
                    some: {
                        path: {
                            isLoading: {},
                            catalogs: {},
                            currentLocale: null,
                            lastKnownError: null,
                            debug: false,
                        },
                    },
                });

                expect($getCatalogs(store.getState())).toEqual({});
                expect($getCurrentCatalog(store.getState())).toEqual(undefined);
                expect($getCurrentLocale(store.getState())).toEqual(null);
                expect($isDebugEnabled(store.getState())).toEqual(false);
                expect($getLastKnownError(store.getState())).toEqual(null);
                expect($getIsLoading(store.getState(), { locale: "en-GB" })).toEqual(false);
            });
        });
    });
});

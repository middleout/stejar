export const Selectors: {
    isDebugEnabled: (state: any) => boolean;
    getCatalogs: (state: any) => { [key: string]: { [key: string]: string } };
    getCurrentCatalog: (state: any) => { [key: string]: string };
    getCurrentLocale: (state: any) => string;
};

export const Actions: {
    loadingCatalog: (locale: string) => { type: string; payload: { locale: string } };
    loadedCatalog: (
        locale: string,
        catalog: { [key: string]: string }
    ) => { type: string; payload: { locale: string; catalog: { [key: string]: string } } };
    failedToLoadCatalog: (
        locale: string,
        error: string
    ) => { type: string; payload: { locale: string; error: string } };
    changeLocale: (locale: string) => (dispatch: Function, getState: Function) => void;
};

export const createReducer = (
    stateSelector: (state: any) => any,
    debug: boolean = false,
    userModuleName: string = "@stejar/intl"
) => Function;

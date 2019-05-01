export const loadingCatalog: (locale: string) => { type: string; payload: { locale: string } };

export const loadedCatalog: (
    locale: string,
    catalog: { [key: string]: string }
) => { type: string; payload: { locale: string; catalog: { [key: string]: string } } };

export const failedToLoadCatalog: (
    locale: string,
    error: string
) => { type: string; payload: { locale: string; error: string } };

export const changeLocale: (locale: string) => (dispatch: Function, getState: Function) => void;

export const enableDebug: () => { type: string };
export const disableDebug: () => { type: string };

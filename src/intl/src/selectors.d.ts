export const $isDebugEnabled: (state: any) => boolean;
export const $getLastKnownError: (state: any) => string;
export const $getIsLoading: (state: any, props: { [locale: string]: string }) => boolean;
export const $getCatalogs: (state: any) => { [key: string]: { [key: string]: string } };
export const $getCurrentCatalog: (state: any) => { [key: string]: string };
export const $getCurrentLocale: (state: any) => string;

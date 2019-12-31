import React, { createContext } from "react";
import { withTranslate } from "./withTranslate";

export const IntlContext = createContext(null);

function IntlContextProviderWithTranslate({ translate, children }) {
    return <IntlContext.Provider value={translate}>{children}</IntlContext.Provider>;
}

export const IntlContextProvider = withTranslate(IntlContextProviderWithTranslate);

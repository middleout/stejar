import { useContext } from "react";
import { IntlContext } from "./IntlContextProvider";

export function useTranslate() {
    return useContext(IntlContext);
}

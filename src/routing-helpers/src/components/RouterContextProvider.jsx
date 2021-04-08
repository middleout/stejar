import { createContext } from "react";

export default createContext({
    state: {},
    routes: {},
});

// export function RouterContextProvider({ routes, children, state }) {
//     const context = {
//         state,
//         routes,
//     };
//
//     return <RouterContext.Provider value={context}>{children}</RouterContext.Provider>;
// }

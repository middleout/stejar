export const ROUTE_CHANGED_ACTION = "@stejar/router/ROUTE_CHANGED";

let OPTIONS = {
    optionsPayload: "payload",
    optionsStoreName: "store",
    payloadRouteName: "routeName",
    payloadParams: "params",
    payloadQuery: "query",
};

export function attachRouterToRedux(router, store, options = OPTIONS) {
    OPTIONS = options;

    router.setOptions({
        [options.optionsStoreName]: store,
    });

    router.subscribe(() => {
        store.dispatch({
            type: ROUTE_CHANGED_ACTION,
            [options.optionsPayload]: {
                [options.payloadRouteName]: router.getMatchedRouteName(),
                [options.payloadParams]: router.getMatchedParams(),
                [options.payloadQuery]: router.getMatchedQuery(),
            },
        });
    });
}

export function routerReducer(state = { routeName: null, params: {}, query: {} }, action) {
    switch (action.type) {
        case ROUTE_CHANGED_ACTION:
            return {
                ...state,
                routeName: action[OPTIONS.optionsPayload][OPTIONS.payloadRouteName],
                params: action[OPTIONS.optionsPayload][OPTIONS.payloadParams],
                query: action[OPTIONS.optionsPayload][OPTIONS.payloadQuery],
            };
        default:
            return state;
    }
}

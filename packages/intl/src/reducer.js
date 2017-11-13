import { CHANGED_LOCALE_ACTION, LOADED_LOCALE_ACTION } from "./actionTypes";

const defaultState = {
    currentLocale: null,
    catalogs: {},
};

export function intlReducer(state = defaultState, action) {
    switch (action.type) {
        case LOADED_LOCALE_ACTION:
            return {
                ...state,
                catalogs: {
                    ...state.catalogs,
                    [action.payload.locale]: action.payload.catalog,
                },
            };
        case CHANGED_LOCALE_ACTION:
            return { ...state, currentLocale: action.payload };
        default:
            return state;
    }
}

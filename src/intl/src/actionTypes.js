export const ACTION_TYPES = {
    LOADING_CATALOG_ACTION: null,
    LOADED_CATALOG_ACTION: null,
    FAILED_TO_LOAD_ACTION: null,
    CHANGED_LOCALE_ACTION: null,
    ENABLED_DEBUG_ACTION: null,
    DISABLED_DEBUG_ACTION: null,
};

Object.keys(ACTION_TYPES).forEach(key => {
    ACTION_TYPES[key] = "@stejar/intl" + "/" + key;
});

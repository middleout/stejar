let stateSelector = state => state["@stejar/intl"];

export function changeStateSelector(stateSelectorFn) {
    stateSelector = stateSelectorFn;
}

export function $getState(state) {
    return stateSelector(state);
}

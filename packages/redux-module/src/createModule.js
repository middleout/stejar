let defaultOptions = {
    generateDefaultState: false,
    defaultState: {},
};

/**
 * @param name
 * @param options
 * @returns {{}}
 */
export function createModule(name, options = defaultOptions) {
    if (!name) {
        throw "Invalid module name";
    }

    let _mountPoint = name;
    let _actionPrefix = () => getMountPoint();
    let stateSelector = state => state[getMountPoint()];
    let defaultState = options.defaultState;

    function getDefaultState() {
        return defaultState;
    }

    function setDefaultState(newState) {
        defaultState = newState;
    }

    function getMountPoint() {
        return _mountPoint;
    }

    function setMountPoint(mountPoint) {
        _mountPoint = mountPoint;
    }

    function setStateSelector(selector) {
        stateSelector = selector;
    }

    function getStateSelector(state) {
        return stateSelector(state);
    }

    function setActionsPrefix(actionPrefix) {
        _actionPrefix = actionPrefix;
    }

    function getActionsPrefix() {
        return typeof _actionPrefix !== "string" ? _actionPrefix() : _actionPrefix;
    }

    let result = {};

    if (options.generateDefaultState) {
        result.getDefaultState = getDefaultState;
        result.setDefaultState = setDefaultState;
    }

    result.getMountPoint = getMountPoint;
    result.setMountPoint = setMountPoint;
    result.setStateSelector = setStateSelector;
    result.getStateSelector = getStateSelector;
    result.setActionsPrefix = setActionsPrefix;
    result.getActionsPrefix = getActionsPrefix;

    return result;
}

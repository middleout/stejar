/**
 * @param Component
 * @return {string}
 */
export function getComponentName(Component) {
    if (Component.WrappedComponent) {
        return getComponentName(Component.WrappedComponent);
    }

    if (Component.displayName) {
        return Component.displayName;
    }

    return Component.name;
}

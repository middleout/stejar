/**
 * @param WrappedComponent
 * @returns {*|string}
 */
export function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || "AnonymousComponent";
}

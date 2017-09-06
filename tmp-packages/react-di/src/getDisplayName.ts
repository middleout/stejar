/**
 * @param WrappedComponent
 * @returns {string|string}
 */
export function getDisplayName(WrappedComponent: any): string {
    return WrappedComponent.displayName || WrappedComponent.name || "AnonymousComponent";
}
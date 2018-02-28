/**
 * @param dependencies
 * @returns {function(*)}
 */
export function inject(...dependencies) {
    return WrappedClass => {
        WrappedClass.$inject = dependencies;

        return WrappedClass;
    };
}

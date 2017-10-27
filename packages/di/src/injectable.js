/**
 * @param dependencies
 * @returns {function(*)}
 */
export function injectable(...dependencies) {
    return WrappedClass => {
        WrappedClass.$inject = dependencies;

        return WrappedClass;
    };
}

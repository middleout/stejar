/**
 * Used to setup the Injection system for the class.
 * It sets up a static array of dependencies on the class
 * which is then read by the SM which will use to pass
 * in the specified order to the constructor
 *
 * @param dependencies
 * @returns {function(*)}
 */
export function inject(...dependencies) {
    return WrappedClass => {
        WrappedClass.$inject = dependencies;

        return WrappedClass;
    };
}

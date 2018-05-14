/**
 * Used to setup the Injection system for the class
 * for Typescript based systems.
 * It just returns the class. Since it is a decorator,
 * it will automatically set the Reflect Metadata settings
 * which will be used by the TS system to deduct the types
 * of the dependencies from the constructor.
 *
 * @param WrappedClass
 * @returns {WrappedClass}
 */
export function injectable(WrappedClass) {
    return WrappedClass;
}

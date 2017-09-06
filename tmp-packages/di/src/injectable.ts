/**
 * @param WrappedClass
 * @returns {T}
 */
export function injectable<T>(WrappedClass: T): T {
    return WrappedClass;
}

/**
 * @param name
 * @param payload
 * @returns {{type: *, payload: undefined}}
 */
export function createAction(name, payload) {
    return { type: name, payload: payload ? payload : undefined };
}

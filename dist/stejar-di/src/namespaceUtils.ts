/**
 * @param namespace
 * @returns {function(Function): Function}
 */
export function namespace( namespace: string ): Function {
    return function namespacedClass( entity: Function ): Function {
        (entity as any).namespace = namespace;
        return entity;
    }
}

/**
 * @param object
 * @returns {string}
 */
export function getNamespacedName( object: Object ): string {

    let name = typeof object === "function" ? (object as any).name : (object.constructor as any).name;

    if ( (object as any).namespace ) {
        name = (object as any).namespace + '/' + name;
    }

    if ( (object.constructor as any).namespace ) {
        name = (object.constructor as any).namespace + '/' + name;
    }

    return name;
}
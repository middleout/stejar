import {ServiceManager} from "./ServiceManager";

/**
 * @param serviceManager
 * @param classToInvoke
 * @returns {function(...[any]): any}
 * @constructor
 */
export function Resolver( classToInvoke: {new( ...args: any[] ): any}, methodToInvoke: string = "invoke" ) {
    return ( serviceManager: ServiceManager ) => {
        return function resolveViaClass( ...args: any[] ) {
            return serviceManager.get(classToInvoke)[methodToInvoke](...args);
        }
    }
}
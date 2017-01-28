import { ServiceManager } from "./ServiceManager";
/**
 * @param serviceManager
 * @param classToInvoke
 * @returns {function(...[any]): any}
 * @constructor
 */
export declare function Resolver(classToInvoke: {
    new (...args: any[]): any;
}, methodToInvoke?: string): (serviceManager: ServiceManager) => (...args: any[]) => any;

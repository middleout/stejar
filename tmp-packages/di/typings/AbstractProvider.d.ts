import { ServiceManager } from "./ServiceManager";
export declare abstract class AbstractProvider<T> {
    /**
     * @type {typeof T}
     */
    abstract provides(): {
        new (...args: any[]): T;
    } | string;
    /**
     * @param serviceManager
     * @returns {T}
     */
    abstract provide(serviceManager: ServiceManager): T;
}
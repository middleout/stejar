import {ServiceManager} from "./ServiceManager";
export abstract class AbstractProvider<T> {

    /**
     * @type {typeof T}
     */
    abstract provides(): {new( ...args: any[] ): T};

    /**
     * @param serviceManager
     * @returns {T}
     */
    abstract provide( serviceManager: ServiceManager ): T;
}
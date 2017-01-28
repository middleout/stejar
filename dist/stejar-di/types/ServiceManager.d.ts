import "reflect-metadata";
import { AbstractProvider } from "./AbstractProvider";
export declare class ServiceManager {
    /**
     * @type {{}}
     */
    protected container: {
        [key: string]: any;
    };
    /**
     * @type {{}}
     */
    protected providers: {
        [key: string]: any;
    };
    /**
     * @type {{}}
     */
    protected implementsList: {
        [methodName: string]: any;
    };
    /**
     * @constructor
     */
    constructor();
    /**
     * @param resource
     * @param instance
     */
    bind(resource: string | Function | any, instance: any): this;
    /**
     * @param resource
     * @param aliasName
     * @returns {ServiceManager}
     */
    alias<R, A>(resource: string | {
        new (...args: any[]): R;
    }, aliasName: string | {
        new (...args: any[]): A;
    }): this;
    /**
     * @param method
     * @param object
     * @returns {this}
     */
    bindToMethod(method: string, object: Function): this;
    /**
     * @param factory
     */
    factory(...factories: {
        (serviceManager: ServiceManager): void;
    }[]): this;
    /**
     * @param className
     * @param callback
     * @returns {this}
     */
    provide<T>(className: {
        new (...args: any[]): T;
    } | string, callback: (serviceManager: ServiceManager) => T): this;
    /**
     * @param provider
     * @returns {this}
     */
    provider(...providers: {
        new (...args: any[]): AbstractProvider<any>;
    }[]): this;
    /**
     * @param resource
     * @returns {any}
     */
    get<T, I extends string>(resource?: {
        new (...args: any[]): T;
    } | I): T;
    /**
     * @param resource
     */
    instantiate<T>(resource: string | Function | any): T;
    /**
     * @param resource
     * @returns {string}
     */
    protected getNameFromResource(resource: string | Function): string;
}

import "reflect-metadata";
import { AbstractProvider } from "./AbstractProvider";
export declare class ServiceManager {
    /**
     * @type {{}}
     */
    protected container: {
        [key: string]: (() => any);
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
     * Binds an instance of an object to a certain identifier.
     * Returns the ServiceManager so that it can be chained with other methods.
     *
     * @param resource
     * @param instance
     *
     * @returns {ServiceManager}
     */
    set<T>(resource: string | (() => any) | any, instance: T | (() => T)): this;
    /**
     * @deprecated Use set()
     *
     * Binds an instance of an object to a certain identifier.
     * Returns the ServiceManager so that it can be chained with other methods.
     *
     * @param resource
     * @param instance
     *
     * @returns {ServiceManager}
     */
    bind<T>(resource: string | (() => any) | any, instance: T | (() => T)): this;
    /**
     * Aliases a certain identifier to another identifier in order to substitute
     * values under different names.
     * Returns the ServiceManager so that it can be chained with other methods.
     *
     * @param resource
     * @param aliasName
     *
     * @returns {ServiceManager}
     */
    alias<R, A>(resource: string | {
        new (...args: any[]): R;
    }, aliasName: string | {
        new (...args: any[]): A;
    }): this;
    /**
     * Allows "setter" injection for a certain alias name, instance of class name.
     * Normally used when constructor injection is not possible or needed.
     * Returns the ServiceManager so that it can be chained with other methods.
     *
     * @param method
     * @param object
     *
     * @returns {ServiceManager}
     */
    bindToMethod<T>(method: string, object: {
        new (...args: any[]): T;
    } | string): this;
    /**
     * Allows you to define a function (or functions) that are run imediatly,
     * receiving a single argument: the Service Manager.
     * Returns the ServiceManager so that it can be chained with other methods.
     *
     * @param factories
     *
     * @returns {ServiceManager}
     */
    factory(...factories: Array<(serviceManager: ServiceManager) => void>): this;
    /**
     * Defines a callback function to be run when asking for a certain resource.
     * The callback function is run only once and the result is saved & shared for
     * that particular resource. The callback receives a single argument -
     * the service manager - and must return anything (a truthy value).
     * Returns the ServiceManager so that it can be chained with other methods.
     *
     * @param className
     * @param callback
     *
     * @returns {ServiceManager}
     */
    provide<T>(className: {
        new (...args: any[]): T;
    } | string, callback: (serviceManager: ServiceManager) => T): this;
    /**
     * Similar to the @provide API, the providers are classes that allow you
     * to build an object for a given identifier based on certain rules.
     * Returns the ServiceManager so that it can be chained with other methods.
     *
     * @param providers
     *
     * @returns {ServiceManager}
     */
    provider(...providers: Array<{
        new (...args: any[]): AbstractProvider<any>;
    }>): this;
    /**
     * Allows the Service Manager to return values from the container.
     * Accepts strings or classes.
     * Returns the instance associated to the resource.
     *
     * @param resource
     *
     * @returns {T}
     */
    get<T, I extends string>(resource?: {
        new (...args: any[]): T;
    } | I): T;
    /**
     * Allows the Service Manager to instantiate a certain class.
     * It builds (or reuses) all the dependencies of the resource, deeply.
     * Also applies all "method" bindings (setter injection) before returning the
     * actual instance. Does not store the instance in the container nor does it do
     * anything with it. This method should mostly be avoided and the "get" API should
     * be used instead.
     * This method does *not* reuse instances.
     *
     * @param resource
     *
     * @returns {T}
     */
    instantiate<T>(resource: string | (() => any) | any): T;
    /**
     * @param resource
     *
     * @returns {string}
     */
    protected getNameFromResource<T>(resource: string | {
        new (...args: any[]): T;
    }): string;
}

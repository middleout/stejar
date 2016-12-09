// Generated by dts-bundle v0.6.1

import "reflect-metadata";
export class ServiceManager {
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

export abstract class AbstractProvider<T> {
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

/**
    * @param namespace
    * @returns {function(Function): Function}
    */
export function namespace(namespace: string): Function;
/**
    * @param object
    * @returns {string}
    */
export function getNamespacedName(object: Object): string;

export function injectable<T>(WrappedClass: T): T;

/**
  * @param serviceManager
  * @param classToInvoke
  * @returns {function(...[any]): any}
  * @constructor
  */
export function Resolver(classToInvoke: {
    new (...args: any[]): any;
}, methodToInvoke?: string): (serviceManager: ServiceManager) => (...args: any[]) => any;


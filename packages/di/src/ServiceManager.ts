import invariant from "invariant";
import "reflect-metadata";
import { AbstractProvider } from "./AbstractProvider";

export class ServiceManager {
    /**
     * @type {{}}
     */
    protected container: { [key: string]: any } = {};

    /**
     * @type {{}}
     */
    protected providers: { [key: string]: any } = {};

    /**
     * @type {{}}
     */
    protected implementsList: { [methodName: string]: any } = {};

    /**
     * @constructor
     */
    constructor() {
        this.bind(ServiceManager, this);
    }

    /**
     * Binds an instance of an object to a certain identifier.
     * Returns the ServiceManager so that it can be chained with other methods.
     *
     * @param resource
     * @param instance
     *
     * @returns {ServiceManager}
     */
    bind(resource: string | (() => any) | any, instance: any): this {
        this.container[this.getNameFromResource(resource)] = instance;
        return this;
    }

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
    alias<R, A>(resource: string | { new (...args: any[]): R }, aliasName: string | { new (...args: any[]): A }): this {
        this.providers[this.getNameFromResource(resource)] = (): A => this.get(aliasName) as A;
        return this;
    }

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
    bindToMethod<T>(method: string, object: { new (...args: any[]): T } | string): this {
        this.implementsList[method] = object;
        return this;
    }

    /**
     * Allows you to define a function (or functions) that are run imediatly,
     * receiving a single argument: the Service Manager.
     * Returns the ServiceManager so that it can be chained with other methods.
     *
     * @param factories
     *
     * @returns {ServiceManager}
     */
    factory(...factories: Array<(serviceManager: ServiceManager) => void>): this {
        factories.map(factory => factory(this));
        return this;
    }

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
    provide<T>(className: { new (...args: any[]): T } | string, callback: (serviceManager: ServiceManager) => T): this {
        this.providers[this.getNameFromResource(className)] = (): T => {
            const instance = callback(this);
            if (!instance) {
                throw new Error(
                    `The provider for the class "${(className as any)
                        .name}" must provide *something*. Got "${typeof instance}" instead.`
                );
            }
            this.bind(this.getNameFromResource(className), instance);
            return instance;
        };
        return this;
    }

    /**
     * Similar to the @provide API, the providers are classes that allow you
     * to build an object for a given identifier based on certain rules.
     * Returns the ServiceManager so that it can be chained with other methods.
     *
     * @param providers
     *
     * @returns {ServiceManager}
     */
    provider(...providers: Array<{ new (...args: any[]): AbstractProvider<any> }>): this {
        providers.map(provider => {
            const realProvider = new provider();
            this.provide(realProvider.provides(), realProvider.provide.bind(realProvider));
        });

        return this;
    }

    /**
     * Allows the Service Manager to return values from the container.
     * Accepts strings or classes.
     * Returns the instance associated to the resource.
     *
     * @param resource
     *
     * @returns {T}
     */
    get<T, I extends string>(resource?: { new (...args: any[]): T } | I): T {
        if (!resource) {
            return { ...this.container } as any;
        }

        if (this.container[this.getNameFromResource(resource)]) {
            return this.container[this.getNameFromResource(resource)];
        }

        if (this.providers[this.getNameFromResource(resource)]) {
            return this.providers[this.getNameFromResource(resource)](this);
        }

        if (typeof resource === "string") {
            throw new Error(`Cannot get "${resource}". There is no alias for this "string".`);
        }

        const result = this.instantiate(resource) as T;
        invariant(result, `Could not "get" ${this.getNameFromResource(resource)}`);

        this.bind(resource, result);
        return result;
    }

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
    instantiate<T>(resource: string | (() => any) | any): T {
        // TODO. Although this should NOT default to [], when a class does NOT have a constructor, it would fail.
        const args: any[] = Reflect.getMetadata("design:paramtypes", resource) || [];

        const dependencies: any[] = [];
        args.forEach(arg => dependencies.push(this.get(arg)));

        const instance = new resource(...dependencies);

        Object.keys(this.implementsList).forEach(key => {
            if (key in instance) {
                instance[key](this.get(this.implementsList[key]));
            } else {
                for (const item in instance) {
                    if (key === item) {
                        instance[key](this.get(this.implementsList[key]));
                    }
                }
            }
        });

        return instance;
    }

    /**
     * @param resource
     *
     * @returns {string}
     */
    protected getNameFromResource<T>(resource: string | { new (...args: any[]): T }): string {
        if (typeof resource === "string") {
            return resource as string;
        }

        return resource.name;
    }
}

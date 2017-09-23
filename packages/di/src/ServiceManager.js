import invariant from "invariant";
import "reflect-metadata";

export class ServiceManager {
    /**
     * @constructor
     */
    constructor() {
        this._container = {};
        this._providers = {};
        this._implementsList = {};
        this.set(ServiceManager, this);
    }

    /**
     * Binds an instance of an object to a certain identifier.
     * Returns the ServiceManager so that it can be chained with other methods.
     *
     * @param resource
     * @param instance
     * @returns {ServiceManager}
     */
    set(resource, instance) {
        let finalInstance = instance;

        // if ((typeof instance as any) !== "function" || (instance.constructor && instance.constructor.name !== "Function")) {
        if (typeof instance !== "function") {
            finalInstance = () => instance;
        }

        this._container[this._getNameFromResource(resource)] = finalInstance;
        return this;
    }

    /**
     * Aliases a certain identifier to another identifier in order to substitute
     * values under different names.
     * Returns the ServiceManager so that it can be chained with other methods.
     *
     * @param resource
     * @param aliasName
     * @returns {ServiceManager}
     */
    alias(resource, aliasName) {
        this._providers[this._getNameFromResource(resource)] = () => this.get(aliasName);
        return this;
    }

    /**
     * Allows "setter" injection for a certain alias name, instance of class name.
     * Normally used when constructor injection is not possible or needed.
     * Returns the ServiceManager so that it can be chained with other methods.
     *
     * @param method
     * @param object
     * @returns {ServiceManager}
     */
    bindToMethod(method, object) {
        this._implementsList[method] = object;
        return this;
    }

    /**
     * Allows you to define a function (or functions) that are run imediatly,
     * receiving a single argument: the Service Manager.
     * Returns the ServiceManager so that it can be chained with other methods.
     *
     * @param factories
     * @returns {ServiceManager}
     */
    factory(...factories) {
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
     * @returns {ServiceManager}
     */
    provide(className, callback) {
        this._providers[this._getNameFromResource(className)] = () => {
            const instance = callback(this);
            if (!instance) {
                throw new Error(
                    `The provider for the class "${className.name}" must provide *something*. Got "${typeof instance}" instead.`
                );
            }
            this.set(this._getNameFromResource(className), () => instance);
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
     * @returns {ServiceManager}
     */
    provider(...providers) {
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
     * @returns {*}
     */
    get(resource) {
        if (!resource) {
            return { ...this._container };
        }

        const resourceName = this._getNameFromResource(resource);

        if (Object.keys(this._container).includes(resourceName)) {
            return this._container[resourceName]();
        }

        if (this._providers[resourceName]) {
            return this._providers[resourceName](this);
        }

        if (typeof resource === "string") {
            throw new Error(`Cannot get "${resource}". There is no alias for this "string".`);
        }

        const result = this.instantiate(resource);
        invariant(result, `Could not "get" ${resourceName}`);

        this.set(resourceName, () => result);
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
     * @returns {*}
     */
    instantiate(resource) {
        // TODO. Although this should NOT default to [], when a class does NOT have a constructor, it would fail.
        const args = (Reflect.getMetadata("design:paramtypes", resource) || []).concat(resource.$inject || []);

        const dependencies = [];
        args.forEach(arg => dependencies.push(this.get(arg)));

        const instance = new resource(...dependencies);

        Object.keys(this._implementsList).forEach(key => {
            if (key in instance) {
                instance[key](this.get(this._implementsList[key]));
            } else {
                for (const item in instance) {
                    if (key === item) {
                        instance[key](this.get(this._implementsList[key]));
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
    _getNameFromResource(resource) {
        if (typeof resource === "string") {
            return resource;
        }

        return resource.name;
    }
}

import invariant from "invariant";
import "reflect-metadata";

export class ServiceManager {
    /**
     * @constructor
     */
    constructor() {
        this._allowOverride = false;
        this._containerKeys = [];
        this._containerValues = {};
        this._providersKeys = [];
        this._providersValues = {};
        this._implementsList = {};
        this.set(ServiceManager, this);
    }

    /**
     * Marks if the clients of the ServiceMaanger can overwrite
     * data inside the container
     * Returns the ServiceManager so that it can be chained with other methods.
     *
     * @param flag
     * @returns {ServiceManager}
     */
    setAllowOverride(flag) {
        this._allowOverride = flag;
        return this;
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
        if (!this._allowOverride) {
            if (this._containerKeys.includes(resource)) {
                throw new Error("Resource " + JSON.stringify(resource) + " already exists in the ServiceManager.");
            }
        }

        // let finalInstance = () => instance;

        // if ((typeof instance as any) !== "function" || (instance.constructor && instance.constructor.name !== "Function")) {
        // if (typeof instance !== "function") {
        // finalInstance = () => instance;
        // }

        this._containerKeys.push(resource);
        this._containerValues[this._containerKeys.length - 1] = () => instance;

        return this;
    }

    /**
     * Aliases a certain identifier {targetResource}
     * to another identifier {aliasResource} in order to substitute
     * values under different names.
     * Returns the ServiceManager so that it can be chained with other methods.
     *
     * @param aliasResource
     * @param targetResource
     * @returns {ServiceManager}
     */
    alias(aliasResource, targetResource) {
        if (!this._allowOverride) {
            if (this._containerKeys.includes(aliasResource)) {
                throw new Error("Resource " + JSON.stringify(aliasResource) + " already exists in the ServiceManager.");
            }
        }

        if (!this.has(targetResource)) {
            throw new Error("Resource " + JSON.stringify(targetResource) + " does not exists in the ServiceManager.");
        }

        this._containerKeys.push(aliasResource);
        this._containerValues[this._containerKeys.length - 1] = () => this.get(targetResource);
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
     * Defines a callback function to be run when asking for a certain resource.
     * The callback function is run only once and the result is saved & shared for
     * that particular resource. The callback receives a single argument -
     * the service manager - and must return anything (a truthy value).
     * Returns the ServiceManager so that it can be chained with other methods.
     *
     * @param resourceToProvide
     * @param callback
     * @returns {ServiceManager}
     */
    provide(resourceToProvide, callback) {
        this._providersKeys.push(resourceToProvide);
        this._providersValues[this._providersKeys.length - 1] = () => {
            const instance = this.has(callback) ? this.get(callback) : callback(this);
            if (!instance) {
                let r = JSON.stringify(resourceToProvide);
                if (!r) {
                    r = resourceToProvide.toString();
                }
                throw new Error(
                    `The provider for the class "${r}" must provide *something*. Got "${typeof instance}" instead.`
                );
            }
            this.set(resourceToProvide, instance);
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
     * Allows the Service Manager to check if the container has a certain value.
     * Accepts strings or classes.
     * Returns a boolean indicating if the container has that resource or not.
     *
     * @param resource
     * @returns {boolean}
     */
    has(resource) {
        return this._containerKeys.includes(resource) || this._providersKeys.includes(resource);
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
        if (this._containerKeys.includes(resource)) {
            return this._containerValues[this._containerKeys.indexOf(resource)]();
        }

        if (this._providersKeys.includes(resource)) {
            return this._providersValues[this._providersKeys.indexOf(resource)]();
        }

        if (typeof resource === "string") {
            throw new Error(`Cannot get "${resource}". There is no alias for this "string".`);
        }

        const result = this.instantiate(resource);
        invariant(result, `Could not "get"`, resource);

        this.set(resource, result);
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
}

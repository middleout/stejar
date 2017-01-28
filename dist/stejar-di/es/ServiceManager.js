"use strict";
var tslib_1 = require("tslib");
require("reflect-metadata");
var namespaceUtils_1 = require("./namespaceUtils");
var invariant = require("invariant");
var ServiceManager = ServiceManager_1 = (function () {
    /**
     * @constructor
     */
    function ServiceManager() {
        /**
         * @type {{}}
         */
        this.container = {};
        /**
         * @type {{}}
         */
        this.providers = {};
        /**
         * @type {{}}
         */
        this.implementsList = {};
        this.bind(ServiceManager_1, this);
    }
    /**
     * @param resource
     * @param instance
     */
    ServiceManager.prototype.bind = function (resource, instance) {
        this.container[this.getNameFromResource(resource)] = instance;
        return this;
    };
    /**
     * @param resource
     * @param aliasName
     * @returns {ServiceManager}
     */
    ServiceManager.prototype.alias = function (resource, aliasName) {
        var _this = this;
        this.providers[this.getNameFromResource(resource)] = function () { return _this.get(aliasName); };
        return this;
    };
    /**
     * @param method
     * @param object
     * @returns {this}
     */
    ServiceManager.prototype.bindToMethod = function (method, object) {
        this.implementsList[method] = object;
        return this;
    };
    /**
     * @param factory
     */
    ServiceManager.prototype.factory = function () {
        var _this = this;
        var factories = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            factories[_i] = arguments[_i];
        }
        factories.map(function (factory) { return factory(_this); });
        return this;
    };
    /**
     * @param className
     * @param callback
     * @returns {this}
     */
    ServiceManager.prototype.provide = function (className, callback) {
        var _this = this;
        this.providers[this.getNameFromResource(className)] = function () {
            var instance = callback(_this);
            if (!instance) {
                throw new Error("The provider for the class \"" + className.name + "\" must provide an instance of this class when initialized.");
            }
            _this.bind(_this.getNameFromResource(className), instance);
            return instance;
        };
        return this;
    };
    /**
     * @param provider
     * @returns {this}
     */
    ServiceManager.prototype.provider = function () {
        var _this = this;
        var providers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            providers[_i] = arguments[_i];
        }
        providers.map(function (provider) {
            var realProvider = new provider();
            _this.provide(realProvider.provides(), realProvider.provide.bind(realProvider));
        });
        return this;
    };
    /**
     * @param resource
     * @returns {any}
     */
    ServiceManager.prototype.get = function (resource) {
        if (!resource) {
            return Object.assign({}, this.container);
        }
        if (this.container[this.getNameFromResource(resource)]) {
            return this.container[this.getNameFromResource(resource)];
        }
        if (this.providers[this.getNameFromResource(resource)]) {
            return this.providers[this.getNameFromResource(resource)](this);
        }
        var result = this.instantiate(resource);
        invariant(result, "Could not \"get\" " + this.getNameFromResource(resource));
        this.bind(resource, result);
        return result;
    };
    /**
     * @param resource
     */
    ServiceManager.prototype.instantiate = function (resource) {
        var _this = this;
        var args = Reflect.getMetadata('design:paramtypes', resource) || [];
        var dependencies = [];
        try {
            args.forEach(function (arg) { return dependencies.push(_this.get(arg)); });
        }
        catch (error) {
            console.warn("Could not get constructor dependencies for " + resource.name + ". Please check the bellow error for more details.");
            throw error;
        }
        var instance = new (resource.bind.apply(resource, [void 0].concat(dependencies)))();
        Object.keys(this.implementsList).forEach(function (key) {
            if (key in instance) {
                instance[key](_this.get(_this.implementsList[key]));
            }
            else {
                for (var item in instance) {
                    if (key === item) {
                        instance[key](_this.get(_this.implementsList[key]));
                    }
                }
            }
        });
        return instance;
    };
    /**
     * @param resource
     * @returns {string}
     */
    ServiceManager.prototype.getNameFromResource = function (resource) {
        if (typeof resource === "string") {
            return resource;
        }
        return namespaceUtils_1.getNamespacedName(resource);
    };
    return ServiceManager;
}());
ServiceManager = ServiceManager_1 = tslib_1.__decorate([
    namespaceUtils_1.namespace('Stejar/Core'),
    tslib_1.__metadata("design:paramtypes", [])
], ServiceManager);
exports.ServiceManager = ServiceManager;
var ServiceManager_1;

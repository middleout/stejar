require("babel-polyfill");
require("es6-promise").polyfill();
import { ServiceManager } from "@stejar/di";
export class Application extends ServiceManager {
    constructor() {
        super(...arguments);
        /**
         * @type {Array}
         */
        this.modules = [];
        /**
         * @type {Array}
         */
        this.modulesNames = [];
    }
    /**
     * @param modules
     * @returns {Application}
     */
    bootstrapModule(...modules) {
        modules.map(moduleClass => {
            const module = new moduleClass();
            if (!this.modulesNames.includes(moduleClass.name)) {
                (module.getModules ? module.getModules() : []).map(dependency => this.bootstrapModule(dependency));
                this.modulesNames.push(moduleClass.name);
                this.modules.push(module);
            }
        });
        return this;
    }
    /**
     * @returns {AbstractProvider<any>[]};
     */
    getProviders() {
        return this.modules.map((module) => {
            if (module.getProviders) {
                const providers = module.getProviders() || [];
                return providers;
            }
            return [];
        })
            .reduce((providersA, providersB) => providersA.concat(providersB))
            .filter((item, idx, self) => self.indexOf(item) === idx);
    }
    /**
     * @returns {Promise<void>|Promise<void>}
     */
    configure() {
        return this.doConfigure(this.modules.slice(0));
    }
    /**
     * @returns {Promise<void>|Promise<void>}
     */
    bootstrap() {
        this.getProviders().map((provider) => this.provider(provider));
        return this.doBootstrap(this.modules.slice(0));
    }
    /**
     * @returns {Promise<TResult>}
     */
    run() {
        return this.configure().then(() => this.bootstrap());
    }
    /**
     * @param modules
     * @returns {Promise<void>}
     */
    doConfigure(modules) {
        if (modules.length > 0) {
            const module = modules.shift();
            const promise = (module.configure ? module.configure(this) : null) || Promise.resolve();
            return promise.then(() => this.doConfigure(modules));
        }
        return Promise.resolve();
    }
    /**
     * @param modules
     * @returns {Promise<void>}
     */
    doBootstrap(modules) {
        if (modules.length > 0) {
            const module = modules.shift();
            const promise = (module.bootstrap ? module.bootstrap(this) : null) || Promise.resolve();
            return promise.then(() => this.doBootstrap(modules));
        }
        return Promise.resolve();
    }
}
//# sourceMappingURL=Application.js.map
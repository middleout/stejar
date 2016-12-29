import { ServiceManager, AbstractProvider } from "@stejar/di";
import { ModuleContract } from "./ModuleContract";
export declare class Application extends ServiceManager implements ModuleContract {
    /**
     * @type {Array}
     */
    protected modules: ModuleContract[];
    /**
     * @type {Array}
     */
    protected modulesNames: string[];
    /**
     * @param modules
     * @returns {Application}
     */
    bootstrapModule(...modules: {
        new (): ModuleContract;
    }[]): this;
    /**
     * @returns {AbstractProvider<any>[]};
     */
    getProviders(): {
        new (...args: any[]): AbstractProvider<any>;
    }[];
    /**
     * @returns {Promise<void>|Promise<void>}
     */
    configure(): Promise<any>;
    /**
     * @returns {Promise<void>|Promise<void>}
     */
    bootstrap(): Promise<any>;
    /**
     * @returns {Promise<TResult>}
     */
    run(): Promise<any>;
    /**
     * @param modules
     * @returns {Promise<void>}
     */
    protected doConfigure(modules: any[]): any;
    /**
     * @param modules
     * @returns {Promise<void>}
     */
    protected doBootstrap(modules: any[]): any;
}

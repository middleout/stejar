import "./polyfills";
import { ServiceManager, AbstractProvider } from "@stejar/di";
import {ModuleContract} from "./ModuleContract";

export class Application extends ServiceManager implements ModuleContract {

	/**
	 * @type {Array}
	 */
	protected modules: ModuleContract[] = [];

	/**
	 * @type {Array}
	 */
	protected modulesNames: string[]    = [];

	/**
	 * @param modules
	 * @returns {Application}
	 */
	bootstrapModule( ...modules: {new(): ModuleContract}[] ): this {
		modules.map(moduleClass => {
			const module = new moduleClass();
			if ( !this.modulesNames.includes(moduleClass.name) ) {
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
	getProviders(): {new( ...args: any[] ): AbstractProvider<any>}[] {
		return this.modules.map(( module: any ) => {
				if ( module.getProviders ) {
					const providers = module.getProviders() || [];
					return providers;
				}

				return [];
			})
			.reduce(( providersA, providersB ) => providersA.concat(providersB))
			.filter(( item: any, idx: number, self: any[] ) => self.indexOf(item) === idx);
	}

	/**
	 * @returns {Promise<void>|Promise<void>}
	 */
	configure(): Promise<any> {
		return this.doConfigure(this.modules.slice(0));
	}

	/**
	 * @returns {Promise<void>|Promise<void>}
	 */
	bootstrap(): Promise<any> {
		this.getProviders().map(( provider: any ) => this.provider(provider));
		return this.doBootstrap(this.modules.slice(0));
	}

	/**
	 * @returns {Promise<TResult>}
	 */
	run(): Promise<any> {
		return this.configure().then(() => this.bootstrap());
	}

	/**
	 * @param modules
	 * @returns {Promise<void>}
	 */
	protected doConfigure( modules: any[] ) {
		if ( modules.length > 0 ) {
			const module  = modules.shift();
			const promise = (module.configure ? module.configure(this) : null) || Promise.resolve();
			return promise.then(() => this.doConfigure(modules))
		}

		return Promise.resolve();
	}

	/**
	 * @param modules
	 * @returns {Promise<void>}
	 */
	protected doBootstrap( modules: any[] ) {
		if ( modules.length > 0 ) {
			const module  = modules.shift();
			const promise = (module.bootstrap ? module.bootstrap(this) : null) || Promise.resolve();
			return promise.then(() => this.doBootstrap(modules))
		}

		return Promise.resolve();
	}
}

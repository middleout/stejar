declare var require: Function;
import "reflect-metadata";
const invariant = require("invariant");
import { getNamespacedName, namespace } from "./namespaceUtils";
import { AbstractProvider } from "./AbstractProvider";

@namespace('Stejar/Core')
export class ServiceManager {

	/**
	 * @type {{}}
	 */
	protected container: {[key: string]: any} = {};

	/**
	 * @type {{}}
	 */
	protected providers: {[key: string]: any} = {};

	/**
	 * @type {{}}
	 */
	protected implementsList: {[methodName: string]: any} = {};

	/**
	 * @constructor
	 */
	constructor() {
		this.bind(ServiceManager, this);
	}

	/**
	 * @param resource
	 * @param instance
	 */
	bind( resource: string|Function|any, instance: any ): this {
		this.container[ this.getNameFromResource(resource) ] = instance;
		return this;
	}

	/**
	 * @param resource
	 * @param aliasName
	 * @returns {ServiceManager}
	 */
	alias<R, A>( resource: string|{new( ...args: any[] ): R}, aliasName: string|{new( ...args: any[] ): A} ): this {
		this.providers[ this.getNameFromResource(resource) ] = (): A => this.get(aliasName) as A;
		return this;
	}

	/**
	 * @param method
	 * @param object
	 * @returns {this}
	 */
	bindToMethod( method: string, object: Function ): this {
		this.implementsList[ method ] = object;
		return this;
	}

	/**
	 * @param factory
	 */
	factory( ...factories: {( serviceManager: ServiceManager ): void}[] ): this {
		factories.map(factory => factory(this));
		return this;
	}

	/**
	 * @param className
	 * @param callback
	 * @returns {this}
	 */
	provide<T>( className: { new( ...args: any[] ): T; }|string, callback: ( serviceManager: ServiceManager ) => T ): this {
		this.providers[ this.getNameFromResource(className) ] = (): T => {
			let instance = callback(this);
			if ( !instance ) {
				throw new Error(`The provider for the class "${(className as any).name}" must provide an instance of this class when initialized.`);
			}
			this.bind(this.getNameFromResource(className), instance);
			return instance;
		};
		return this;
	}

	/**
	 * @param provider
	 * @returns {this}
	 */
	provider( ...providers: {new( ...args: any[] ): AbstractProvider<any>}[] ): this {

		providers.map(provider => {
			let realProvider = new provider();
			this.provide(realProvider.provides(), realProvider.provide.bind(realProvider));
		});

		return this;
	}

	/**
	 * @param resource
	 * @returns {any}
	 */
	get<T,I extends string>( resource?: { new( ...args: any[] ): T; }|I ): T {

		if (!resource) {
			return Object.assign({}, this.container) as any;
		}

		if ( this.container[ this.getNameFromResource(resource) ] ) {
			return this.container[ this.getNameFromResource(resource) ];
		}

		if ( this.providers[ this.getNameFromResource(resource) ] ) {
			return this.providers[ this.getNameFromResource(resource) ](this);
		}

		let result = this.instantiate(resource) as T;
		invariant(result, `Could not "get" ${this.getNameFromResource(resource)}`);

		this.bind(resource, result);
		return result;
	}

	/**
	 * @param resource
	 */
	instantiate<T>( resource: string|Function|any ): T {
		const args: any[] = Reflect.getMetadata('design:paramtypes', resource);
		if ( typeof args === "undefined" ) {
			throw new Error(`Could not get constructor dependencies for ${resource.name}. Did you forget to decorate it with @injectable ?`);
		}
		if ( !args ) {
			return new resource();
		}

		const dependencies: any[] = [];
		try {
			args.forEach(arg => dependencies.push(this.get(arg)));
		} catch (error) {
			console.warn(`Could not get constructor dependencies for ${resource.name}. Please check the bellow error for more details.`);
			throw error;
		}

		const instance = new resource(...dependencies);

		Object.keys(this.implementsList).forEach(key => {

			if ( key in instance ) {
				instance[ key ](this.get(this.implementsList[ key ]));
			} else {
				for ( var item in instance ) {
					if ( key === item ) {
						instance[ key ](this.get(this.implementsList[ key ]));
					}
				}
			}
		});

		return instance;
	}

	/**
	 * @param resource
	 * @returns {string}
	 */
	protected getNameFromResource( resource: string|Function ): string {
		if ( typeof resource === "string" ) {
			return resource;
		}

		return getNamespacedName(resource);
	}
}

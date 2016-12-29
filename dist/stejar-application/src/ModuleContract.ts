import { AbstractProvider, ServiceManager } from "@stejar/di";

export interface ModuleContract {
	getModules?(): {new(): ModuleContract}[];
	getProviders?(): {new(...args: any[]): AbstractProvider<any>}[];
	configure?(sm: ServiceManager): Promise<any>;
	bootstrap?(sm: ServiceManager): Promise<any>;
}

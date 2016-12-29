import { ServiceManager } from "@stejar/di";
export declare class DOMRenderer {
    protected serviceManager: ServiceManager;
    /**
     * @param serviceManager
     */
    constructor(serviceManager: ServiceManager);
    /**
     * @param Component
     * @param element
     * @returns {Promise<any>}
     */
    render(Component: any, element?: HTMLElement): any;
}

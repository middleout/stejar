import { ServiceManager } from "@stejar/di";
import { Component } from "react";
export interface ServiceProviderProps {
    serviceManager: ServiceManager;
}
export declare class ServiceProvider extends Component<ServiceProviderProps, {}> {
    /**
     * @type {{serviceManager: Validator<T>, children: Validator<any>}}
     */
    static propTypes: any;
    /**
     * @type {{serviceManager: Validator<T>}}
     */
    static childContextTypes: any;
    /**
     * @type {ServiceManager}
     */
    protected serviceManager: ServiceManager;
    /**
     * @param props
     * @param context
     */
    constructor(props: ServiceProviderProps, context?: any);
    /**
     * @returns {{serviceManager: ServiceManager}}
     */
    getChildContext(): {
        serviceManager: ServiceManager;
    };
    /**
     * @returns {ReactElement<any>}
     */
    render(): JSX.Element;
}

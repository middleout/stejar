import { Children, Component } from "react";
import PropTypes from "prop-types";
import { ServiceManager } from "@stejar3/di";
import { shape } from "./shape";

export interface ServiceProviderProps {
    serviceManager: ServiceManager;
}

export class ServiceProvider extends Component<ServiceProviderProps, {}> {
    /**
     * @type {{serviceManager: Validator<T>, children: Validator<any>}}
     */
    static propTypes: any = {
        serviceManager: shape.isRequired,
        children: PropTypes.element.isRequired,
    };

    /**
     * @type {{serviceManager: Validator<T>}}
     */
    static childContextTypes: any = {
        serviceManager: shape.isRequired,
    };

    /**
     * @type {ServiceManager}
     */
    protected serviceManager: ServiceManager;

    /**
     * @param props
     * @param context
     */
    constructor(props: ServiceProviderProps, context?: any) {
        super(props, context);
        this.serviceManager = props.serviceManager;
    }

    /**
     * @returns {{serviceManager: ServiceManager}}
     */
    getChildContext(): { serviceManager: ServiceManager } {
        return { serviceManager: this.serviceManager };
    }

    /**
     * @returns {ReactElement<any>}
     */
    render(): JSX.Element {
        return Children.only(this.props.children);
    }
}

import PropTypes from "prop-types";
import { Children, Component } from "react";
import { shape } from "./shape";

export class ServiceProvider extends Component {
    /**
     * @type {{serviceManager: Validator<T>, children: Validator<any>}}
     */
    static propTypes = {
        children: PropTypes.element.isRequired,
        serviceManager: shape.isRequired,
    };

    /**
     * @type {{serviceManager: Validator<T>}}
     */
    static childContextTypes = {
        serviceManager: shape.isRequired,
    };

    /**
     * @type {ServiceManager}
     */
    _serviceManager = null;

    /**
     * @param props
     * @param context
     */
    constructor(props, context) {
        super(props, context);
        this._serviceManager = props.serviceManager;
    }

    /**
     * @returns {{serviceManager: ServiceManager}}
     */
    getChildContext() {
        return { serviceManager: this._serviceManager };
    }

    /**
     * @returns {ReactElement<any>}
     */
    render() {
        return Children.only(this.props.children);
    }
}

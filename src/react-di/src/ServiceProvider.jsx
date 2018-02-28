import PropTypes from "prop-types";
import { Children, Component } from "react";
// import React, { Children, Component, createContext } from "react";

export class ServiceProvider extends Component {
    /**
     * @type {{serviceManager: Validator<T>, children: Validator<any>}}
     */
    static propTypes = {
        children: PropTypes.element.isRequired,
                      serviceManager: PropTypes.object.isRequired,
    };

    /**
     * @type {ServiceManager}
     */
    _serviceManager = null;

    /**
     * @param props
     * @param context
     */
    constructor(props) {
        super(props);
        this._serviceManager = props.serviceManager;
    }

    render() {
        return Children.only(this.props.children);
    }
}

import PropTypes from "prop-types";
import React, { Children, Component } from "react";
import createReactContext from "create-react-context";

const { Provider, Consumer } = createReactContext(null);
Provider.displayName = "ServiceContextProvider";
Consumer.displayName = "ServiceContextConsumer";

export const ServiceContextConsumer = Consumer;

export class ServiceProvider extends Component {
    /**
     * @type {{serviceManager: Validator<T>, children: Validator<any>}}
     */
    static propTypes = {
        children: PropTypes.element.isRequired,
        serviceManager: PropTypes.object.isRequired,
    };

    render() {
        return <Provider value={this.props.serviceManager}>{Children.only(this.props.children)}</Provider>;
    }
}

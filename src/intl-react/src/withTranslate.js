import { Component, createElement } from "react";
import { connect } from "react-redux";
import { Selectors } from "@stejar/intl";
import { translatorFactory } from "./translatorFactory";

export function withTranslate(WrappedComponent) {
    @connect(state => ({
        "@stejar/intl/catalog": Selectors.getCurrentCatalog(state),
        "@stejar/intl/debug": Selectors.isDebugEnabled(state),
    }))
    class ComponentWithTranslate extends Component {
        render() {
            const props = { ...this.props };

            const translate = translatorFactory(props["@stejar/intl/catalog"], props["@stejar/intl/debug"]);
            delete props["@stejar/intl/catalog"];
            delete props["@stejar/intl/debug"];

            return createElement(WrappedComponent, {
                ...props,
                translate,
                __: translate,
            });
        }
    }

    return ComponentWithTranslate;
}

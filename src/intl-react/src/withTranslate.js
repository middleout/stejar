import { createElement } from "react";
import { connect } from "react-redux";
import { $getCurrentCatalog, $isDebugEnabled } from "@stejar/intl/es/selectors";
import { translatorFactory } from "./translatorFactory";

export function withTranslate(wrappedComponent) {
    function ComponentWithTranslate(props) {
        const overrideProps = { ...props };

        const translate = translatorFactory(overrideProps["@stejar/intl/catalog"], overrideProps["@stejar/intl/debug"]);
        delete overrideProps["@stejar/intl/catalog"];
        delete overrideProps["@stejar/intl/debug"];

        return createElement(wrappedComponent, {
            ...props,
            translate,
        });
    }

    return connect(state => ({
        "@stejar/intl/catalog": $getCurrentCatalog(state),
        "@stejar/intl/debug": $isDebugEnabled(state),
    }))(ComponentWithTranslate);
}

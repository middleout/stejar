import { PureBindedComponent } from "@stejar/binded-components/PureBindedComponent";
import { withRouter } from "@stejar/react-router/withRouter";
import { connect } from "react-redux";
import { Children, cloneElement } from "react";
import { getQueryParam } from "./../selectors";

@withRouter
@connect(state => ({
    queryParam: getQueryParam(state),
}))
export class GlobalState extends PureBindedComponent {
    render() {
        const children = Children.map(this.props.children, child => {
            return cloneElement(child, {
                queryParam: this.props.routing.router.getMatchedQuery()[this.props.queryParam],
            });
        });

        return children;
    }
}

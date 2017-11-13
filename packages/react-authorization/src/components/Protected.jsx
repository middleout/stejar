import { PureBindedComponent } from "@stejar/binded-components/PureBindedComponent";
import { connect } from "react-redux";
import { isAllowed } from "@stejar/authorization/selectors";

@connect((state, props) => ({
    isAllowed: isAllowed(state, props.role, props.resources || [props.resource]),
}))
export class Protected extends PureBindedComponent {
    render() {
        return this.props.isAllowed ? this.props.children : null;
    }
}

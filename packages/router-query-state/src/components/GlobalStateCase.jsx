import { PureBindedComponent } from "@stejar/binded-components/PureBindedComponent";

export class GlobalStateCase extends PureBindedComponent {
    render() {
        if (this.props.queryParam === this.props.when) {
            const Component = this.props.show;
            return <Component />;
        }

        return null;
    }
}

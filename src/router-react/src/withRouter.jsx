// import React, { PureComponent } from "react";
// import hoistStatics from "hoist-non-react-statics";
// import { object } from "prop-types";
// import { RouteMatched } from "@router-testing/router/src/Events/RouteMatched";
//
// function getDisplayName(WrappedComponent) {
//     return WrappedComponent.displayName || WrappedComponent.name || "Component";
// }
//
// function buildWrapper(WrappedComponent) {
//     class WithRouter extends PureComponent {
//         static contextTypes = {
//             router: object,
//         };
//
//         static displayName = `withRouter(${getDisplayName(WrappedComponent)})`;
//         static WrappedComponent = WrappedComponent;
//
//         constructor(props, context) {
//             super(props, context);
//             this.unlisten = () => null;
//             this.router = props.router || context.router;
//             if (!this.router) {
//                 throw new Error("No router detected");
//             }
//         }
//
//         render() {
//             const props = { ...this.props, router: this.router };
//
//             return <WrappedComponent {...props} />;
//         }
//
//         componentDidMount() {
//             const router = this.props.router || this.context.router;
//             if (!router) {
//                 return;
//             }
//             this.unlisten = router.listen(RouteMatched, () => this.forceUpdate());
//         }
//
//         componentWillUnmount() {
//             this.unlisten();
//         }
//     }
//
//     return hoistStatics(WithRouter, WrappedComponent);
// }
//
// export function withRouter(WrappedComponent) {
//     if (!WrappedComponent) {
//         return WrappedComponent => buildWrapper(WrappedComponent);
//     }
//
//     return buildWrapper(WrappedComponent);
// }

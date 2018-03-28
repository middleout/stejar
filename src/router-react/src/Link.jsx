// import React, { Component } from "react";
// import { withRouter } from "./withRouter";
//
// /**
//  * @param router
//  * @param to
//  * @param params
//  * @param query
//  * @param onClick
//  * @param props
//  * @param event
//  */
// function onClick(router, to, params, query, onClick, useCurrentParams, props, event) {
//     event.preventDefault();
//     router.navigate(router.buildUrl(to, params, query, useCurrentParams));
//     if (onClick) {
//         onClick(event, props);
//     }
// }
//
// @withRouter
// export class Link extends Component {
//     /**
//      * @type {{routing: *, children: *, className: shim, onClick: shim, query: shim, params: shim, to: shim}}
//      */
//     static propTypes = {
//         router           : PropTypes.object.isRequired,
//         children         : PropTypes.any.isRequired,
//         className        : PropTypes.string,
//         onClick          : PropTypes.func,
//         query            : PropTypes.object,
//         params           : PropTypes.object,
//         to               : PropTypes.string,
//         useCurrentParams : PropTypes.bool
//     };
//
//     render() {
//         return (
//             <a
//                 onClick={onClick.bind(
//                     null,
//                     this.props.router,
//                     this.props.to,
//                     this.props.params,
//                     this.props.query,
//                     this.props.onClick,
//                     this.props.useCurrentParams,
//                     this.props
//                 )}
//                 href={this.props.router.buildUrl(this.props.to, this.props.params, this.props.query, this.props.useCurrentParams)}
//                 className={this.props.className || ""}>
//                 {this.props.children}
//             </a>
//         );
//     }
// }

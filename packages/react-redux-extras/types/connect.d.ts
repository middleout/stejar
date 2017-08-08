import * as originalReactRedux from "react-redux";

declare module "react-redux" {
    export function connect<S, P>(callback: (state: S, ownProps?: P) => any): any;
}

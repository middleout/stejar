import { PureComponent as ReactPureComponent } from "react";
export declare abstract class PureBindedComponent<P = {}, S = {}> extends ReactPureComponent<P, S> {
    props: P & {
        children?: any;
    };
    /**
     * @param props
     * @param context
     */
    constructor(props: P, context?: any);
}

import { PureComponent as ReactPureComponent } from "react";
import { binder } from "./binder";

export abstract class PureBindedComponent<P = {}, S = {}> extends ReactPureComponent<P, S> {
    props: P & { children?: any };

    /**
     * @param props
     * @param context
     */
    constructor(props: P, context?: any) {
        super(props, context);
        binder(this);
    }
}

import { PureComponent } from "react";
import { binder } from "./binder";

export class PureBindedComponent extends PureComponent {
    /**
     * @param props
     * @param context
     */
    constructor(props, context) {
        super(props, context);
        binder(this);
    }
}

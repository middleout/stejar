import { Component as ReactComponent } from "react";
import { binder } from "./binder";

export abstract class Component<P = {}, S = {}> extends ReactComponent<P, S> {
    props: P & { children?: any };

    /**
     * @param props
     * @param context
     */
    constructor(props: P, context?: any) {
        super(props, context);
        binder(this);
    }

    /**
     * @returns {null}
     */
    componentWillMount(): void {
        return null;
    }

    /**
     * This method is used just for auto completition in editors (override method)
     *
     * @returns {JSX.Element}
     */
    abstract render(): JSX.Element;

    /**
     * This method is used just for auto completition in editors (override method)
     *
     * @returns {null}
     */
    componentDidMount(): void {
        return null;
    }

    /**
     * This method is used just for auto completition in editors (override method)
     *
     * @param nextProps
     * @returns {null}
     */
    componentWillReceiveProps(nextProps: P): void {
        return null;
    }

    /**
     * This method is used just for auto completition in editors (override method)
     *
     * @returns {null}
     */
    shouldComponentUpdate(nextProps: P, nextState: S): boolean {
        return true;
    }

    /**
     * This method is used just for auto completition in editors (override method)
     *
     * @returns {null}
     */
    componentWillUpdate(nextProps: P, nextState: S): void {
        return null;
    }

    /**
     * This method is used just for auto completition in editors (override method)
     *
     * @returns {null}
     */
    componentDidUpdate(prevProps: P, prevState: S): void {
        return null;
    }

    /**
     * This method is used just for auto completition in editors (override method)
     *
     * @returns {null}
     */
    componentWillUnmount(): void {
        return null;
    }
}

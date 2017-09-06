import { Component, createElement } from "react";
import { object } from "prop-types";
import { convertJSXroutesToJSroutes } from "./convertJSXroutesToJSroutes";

export class RouterContainer extends Component {
    constructor(props) {
        super(props);
        this.router = props.router;
        this.unsubscribe = () => null;
        this.stop = () => null;
        this.components = [];

        const { children } = this.props;

        if (children) {
            if (Array.isArray(children)) {
                children.forEach(route => {
                    this.router.add(convertJSXroutesToJSroutes(route));
                });
            } else {
                this.router.add(convertJSXroutesToJSroutes(children));
            }
        }

        // if (this.props.routes) {
        //     let routes = this.props.routes;
        //     if (!Array.isArray(routes)) {
        //         routes = [routes];
        //     }
        //
        //     routes.forEach(route => this.router.add(route));
        // }
    }

    getChildContext() {
        return {
            router: this.router,
        };
    }

    render() {
        if (!this.router.getMatchedRoute()) {
            return null;
        }

        this.buildComponentTree(this.router.getMatchedRoute());
        return this.listToNested(this.components);
    }

    buildComponentTree(spec) {
        if (spec.component) {
            this.components.push(spec.component);
        }

        if (spec.parent) {
            this.buildComponentTree(spec.parent);
        }
    }

    listToNested(list) {
        const X = list.reduce((Accumulator, Current) => {
            return createElement(Current, {}, Accumulator);
        }, ({ children }) => children);

        return X;
    }

    componentWillMount() {
        this.router.start(() => null, this.props.initialized);
    }

    componentDidMount() {
        this.unsubscribe = this.router.subscribe(() => {
            this.components = [];
            this.forceUpdate();
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }
}

RouterContainer.childContextTypes = {
    router: object,
};

import { ServiceManager, injectable } from "@stejar3/di";
import { ServiceProvider, inject } from "@stejar3/react-di";
import React from "react";
import { Component } from "react";
import { render } from "react-dom";

export default function() {
    const sm = new ServiceManager();

    @injectable
    class Tester2 {
        constructor() {
            console.log("Tester 2 constructor");
        }
    }

    @injectable
    class Tester1 {
        constructor(public tester2: Tester2) {
            console.log("Tester 1 constructor");
        }
    }

    interface Props {
        Tester1?: Tester1;
    }

    @inject({
        Tester1: Tester1
    })
    class App extends Component<Props> {
        render() {
            console.warn(this.props);
            return <div>{this.props.Tester1.constructor.name}</div>;
        }
    }

    render(<ServiceProvider serviceManager={sm}><App /></ServiceProvider>, document.getElementById("root"));
}

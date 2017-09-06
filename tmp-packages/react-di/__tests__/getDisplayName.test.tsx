import { getDisplayName } from "../src/getDisplayName";
import { Component } from "react";

test("Should be able to use it", () => {
    class Tester extends Component {}

    const name = getDisplayName(Tester);

    expect(name).toEqual("Tester");
});

test("Should be able to use it - with static displayName", () => {
    class Tester extends Component {
        static displayName: string = "Foo";
    }

    const name = getDisplayName(Tester);

    expect(name).toEqual("Foo");
});

test("Should be able to use it - as a functional component", () => {
    function Tester() {
        return "Hello";
    }

    const name = getDisplayName(Tester);

    expect(name).toEqual("Tester");
});

test("Should be able to use it - with no name", () => {
    const Tester = function() {return "name"};

    const name = getDisplayName(Tester);

    expect(name).toEqual("Tester");
});

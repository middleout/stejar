import React from "react";
import { changeReplacer } from "../src/settings";
import { Translate } from "../src/Translate";
import { createElement } from "react";
import { Provider } from "react-redux";
import { renderToStaticMarkup } from "react-dom/server";
import { bootErrorHandler, bootStore } from "./bootstrap";

describe("Translate", () => {
    const originalConsoleError = console.error;
    beforeEach(() => {
        bootErrorHandler(originalConsoleError);
    });

    afterEach(() => {
        console.error = originalConsoleError;
    });

    test("it can work with a simple string and no translation", () => {
        const store = bootStore({ foo: "bar" });
        const translate = createElement(Provider, { store }, createElement(Translate, {}, "Hello World"));
        const str = renderToStaticMarkup(translate);
        expect(str).toBe("Hello World");
    });

    test("it can work with a simple string and with translation", () => {
        const store = bootStore({ "Hello World": "Ola Amigos!" });
        const translate = createElement(Provider, { store }, createElement(Translate, {}, "Hello World"));
        const str = renderToStaticMarkup(translate);
        expect(str).toBe("Ola Amigos!");
    });

    test("...", () => {
        const store = bootStore({ "Hello :name": "Ola :name !" });
        const translate = createElement(Provider, { store }, createElement(Translate, {}, "Hello :name"));
        const str = renderToStaticMarkup(translate);
        expect(str).toBe("Ola :name !");
    });

    test("...", () => {
        const store = bootStore({ "Hello world": "Ola world !" });
        const translate = createElement(Provider, { store }, createElement(Translate, { name: "Foo" }, "Hello world"));
        const str = renderToStaticMarkup(translate);
        expect(str).toBe("Ola world !");
    });

    test("...", () => {
        const store = bootStore({ foo: "bar" });
        const translate = createElement(Provider, { store }, createElement(Translate, { name: "Foo" }, "Hello :name"));
        const str = renderToStaticMarkup(translate);
        expect(str).toBe("Hello Foo");
    });

    test("...", () => {
        const store = bootStore({ "Hello :name": "Ola :name !" });
        const translate = createElement(Provider, { store }, createElement(Translate, { name: "Foo" }, "Hello :name"));
        const str = renderToStaticMarkup(translate);
        expect(str).toBe("Ola Foo !");
    });

    test("...", () => {
        const store = bootStore({ "Hello :name, how are you?": "Ola :name, how are you?" });
        const translate = createElement(
            Provider,
            { store },
            createElement(Translate, { name: createElement("strong", {}, "Baz") }, "Hello :name, how are you?")
        );
        const str = renderToStaticMarkup(translate);
        expect(str).toBe("Ola <strong>Baz</strong>, how are you?");
    });

    test("...", () => {
        const store = bootStore({ "Foo :name": "Bar :name", "Hello :name, how are you?": "Ola :name, how are you?" });
        const translate = createElement(
            Provider,
            { store },
            createElement(
                Translate,
                { name: createElement(Translate, { name: "Baz" }, "Foo :name") },
                "Hello :name, how are you?"
            )
        );
        const str = renderToStaticMarkup(translate);
        expect(str).toBe("Ola Bar Baz, how are you?");
    });

    test("...", () => {
        changeReplacer((text, key, value) => text.replace("%(" + key + ")", value));
        const store = bootStore({
            "Foo %(name)": "Bar %(name)",
            "Hello %(name), how are you?": "Ola %(name), how are you?",
        });
        const translate = createElement(
            Provider,
            { store },
            createElement(
                Translate,
                { name: createElement(Translate, { name: "Baz" }, "Foo %(name)") },
                "Hello %(name), how are you?"
            )
        );
        const str = renderToStaticMarkup(translate);
        expect(str).toBe("Ola Bar Baz, how are you?");
    });

    test("...", () => {
        const store = bootStore({
            "Hello world": "Hello &#1779;",
        });
        const translate = createElement(Provider, { store }, createElement(Translate, {}, "Hello world"));
        const str = renderToStaticMarkup(translate);
        expect(str).toBe("Hello &amp;#1779;");
    });

    test("...", () => {
        const store = bootStore({
            "Hello world": "Hello &#1779;",
        });
        const translate = createElement(
            Provider,
            { store },
            createElement(
                Translate,
                {
                    dangerous: true,
                },
                "Hello world"
            )
        );
        const str = renderToStaticMarkup(translate);
        expect(str).toBe("<span>Hello &#1779;</span>");
    });

    test("...", () => {
        const store = bootStore({
            "Hello &#1779;": "Hello World",
        });
        const translate = createElement(Provider, { store }, createElement(Translate, {}, "Hello &#1779;"));
        const str = renderToStaticMarkup(translate);
        expect(str).toBe("Hello World");
    });

    // TODO: update tests to use react all of them
    test("...", () => {
        const store = bootStore({
            "Don't do it": "Ola World",
        });

        const str = renderToStaticMarkup(
            <Provider store={store}>
                <Translate>{"Don't do it"}</Translate>
            </Provider>
        );
        expect(str).toBe("Ola World");
    });

    test("...", () => {
        const store = bootStore({
            "Don't do it": "Ola World",
        });

        const str = renderToStaticMarkup(
            <Provider store={store}>
                <Translate var1="Foo" var2="Bar">
                    Hello :var1 and :var2
                </Translate>
            </Provider>
        );
        expect(str).toBe("Hello Foo and Bar");
    });

    test("...", () => {
        const store = bootStore({
            "Don't do it": "Ola World",
            Bar: "Baz",
        });

        const str = renderToStaticMarkup(
            <Provider store={store}>
                <Translate var1={<Translate>Bar</Translate>} var2="Bar">
                    Hello :var1 and :var2 and something else
                </Translate>
            </Provider>
        );
        expect(str).toBe("Hello Baz and Bar and something else");
    });

    test("...", () => {
        const store = bootStore({
            "Don't do it": "Ola World",
            Bar: "Baz",
        });

        const str = renderToStaticMarkup(
            <Provider store={store}>
                <Translate var1={<Translate>Bar</Translate>} var2="Bar">
                    :var1 and :var2 and something else
                </Translate>
            </Provider>
        );
        expect(str).toBe("Baz and Bar and something else");
    });

    test("...", () => {
        changeReplacer((text, key, value) => text.replace("%(" + key + ")", value));

        const store = bootStore({
            Open: "open",
            scan: "Scan",
            "%(open) Google Authenticator and %(scan) the QR Code below:":
                "%(open) Google Authenticator and %(scan) the QR Code below:",
        });

        const str = renderToStaticMarkup(
            <Provider store={store}>
                <Translate
                    open={
                        <strong>
                            <Translate>Open</Translate>
                        </strong>
                    }
                    scan={
                        <strong>
                            <Translate>scan</Translate>
                        </strong>
                    }>
                    %(open) Google Authenticator and %(scan) the QR Code below:
                </Translate>
            </Provider>
        );
        expect(str).toBe("<strong>open</strong> Google Authenticator and <strong>Scan</strong> the QR Code below:");
    });

    test("it can translate when the params order is translated reversed - using only strings", () => {
        const store = bootStore({
            ":param1 and :param2": ":param2 -- :param1",
        });

        const str = renderToStaticMarkup(
            <Provider store={store}>
                <Translate
                    param1="Param 1"
                    param2="Param 2">
                    :param1 and :param2
                </Translate>
            </Provider>
        );
        expect(str).toBe("Param 2 -- Param 1");
    });

    test("it can translate when the params order is translated reversed - using components", () => {
        const store = bootStore({
            ":param1 and :param2": ":param2 -- :param1",
        });

        const str = renderToStaticMarkup(
            <Provider store={store}>
                <Translate
                    param1={<span>Param 1</span>}
                    param2={<span>Param 2</span>}>
                    :param1 and :param2
                </Translate>
            </Provider>
        );
        expect(str).toBe("<span>Param 2</span> -- <span>Param 1</span>");
    });

    test("it can translate when the params order is translated reversed - using components and strings", () => {
        const store = bootStore({
            ":param1 and :param2": ":param2 -- :param1",
        });

        const str = renderToStaticMarkup(
            <Provider store={store}>
                <Translate
                    param1="Param 1"
                    param2={<span>Param 2</span>}>
                    :param1 and :param2
                </Translate>
            </Provider>
        );
        expect(str).toBe("<span>Param 2</span> -- Param 1");
    });
});

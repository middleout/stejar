import { changeReplacer, defaultReplacer } from "../src/settings";
import { Translate } from "../src/Translate";
import { createElement } from "react";
import { reducer as intlReducer } from "@stejar/intl/es/reducer";
import { loadedCatalog, loadingCatalog, changeLocale } from "@stejar/intl/es/actions";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { applyMiddleware, createStore, combineReducers } from "redux";
import { renderToStaticMarkup } from "react-dom/server";

describe("Translate", () => {
    const originalConsoleError = console.error;

    beforeEach(() => {
        changeReplacer(defaultReplacer);

        console.error = jest.fn(msg => {
            if (msg.includes("Warning: useLayoutEffect does nothing on the server")) {
                return null;
            } else {
                originalConsoleError(msg);
            }
        });
    });

    afterEach(() => {
        console.error = originalConsoleError;
    });

    function boot(catalog) {
        const store = createStore(
            combineReducers({
                "@stejar/intl": intlReducer,
            }),
            applyMiddleware(thunk)
        );

        store.dispatch(loadingCatalog("en-GB"));
        store.dispatch(loadedCatalog("en-GB", catalog));
        store.dispatch(changeLocale("en-GB"));

        return store;
    }

    test("it can work with a simple string and no translation", () => {
        const store = boot({ foo: "bar" });
        const translate = createElement(Provider, { store }, createElement(Translate, {}, "Hello World"));
        const str = renderToStaticMarkup(translate);
        expect(str).toBe("Hello World");
    });

    test("it can work with a simple string and with translation", () => {
        const store = boot({ "Hello World": "Ola Amigos!" });
        const translate = createElement(Provider, { store }, createElement(Translate, {}, "Hello World"));
        const str = renderToStaticMarkup(translate);
        expect(str).toBe("Ola Amigos!");
    });

    test("...", () => {
        const store = boot({ "Hello :name": "Ola :name !" });
        const translate = createElement(Provider, { store }, createElement(Translate, {}, "Hello :name"));
        const str = renderToStaticMarkup(translate);
        expect(str).toBe("Ola :name !");
    });

    test("...", () => {
        const store = boot({ "Hello world": "Ola world !" });
        const translate = createElement(Provider, { store }, createElement(Translate, { name: "Foo" }, "Hello world"));
        const str = renderToStaticMarkup(translate);
        expect(str).toBe("Ola world !");
    });

    test("...", () => {
        const store = boot({ foo: "bar" });
        const translate = createElement(Provider, { store }, createElement(Translate, { name: "Foo" }, "Hello :name"));
        const str = renderToStaticMarkup(translate);
        expect(str).toBe("Hello Foo");
    });

    test("...", () => {
        const store = boot({ "Hello :name": "Ola :name !" });
        const translate = createElement(Provider, { store }, createElement(Translate, { name: "Foo" }, "Hello :name"));
        const str = renderToStaticMarkup(translate);
        expect(str).toBe("Ola Foo !");
    });

    test("...", () => {
        const store = boot({ "Hello :name, how are you?": "Ola :name, how are you?" });
        const translate = createElement(
            Provider,
            { store },
            createElement(Translate, { name: createElement("strong", {}, "Baz") }, "Hello :name, how are you?")
        );
        const str = renderToStaticMarkup(translate);
        expect(str).toBe("Ola <strong>Baz</strong>, how are you?");
    });

    test("...", () => {
        const store = boot({ "Foo :name": "Bar :name", "Hello :name, how are you?": "Ola :name, how are you?" });
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
        const store = boot({
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
        const store = boot({
            "Hello world": "Hello &#1779;",
        });
        const translate = createElement(Provider, { store }, createElement(Translate, {}, "Hello world"));
        const str = renderToStaticMarkup(translate);
        expect(str).toBe("Hello &amp;#1779;");
    });

    test("...", () => {
        const store = boot({
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
        const store = boot({
            "Hello &#1779;": "Hello World",
        });
        const translate = createElement(
            Provider,
            { store },
            createElement(
                Translate,
                {},
                "Hello &#1779;"
            )
        );
        const str = renderToStaticMarkup(translate);
        expect(str).toBe("Hello World");
    });
});

import React from "react";
import { IntlContextProvider, useTranslate } from "../src";
import { Provider } from "react-redux";
import { renderToStaticMarkup } from "react-dom/server";
import { bootStore, bootErrorHandler } from "./bootstrap";

describe("useTranslate", () => {
    const originalConsoleError = console.error;
    beforeEach(() => {
        bootErrorHandler(originalConsoleError);
    });

    afterEach(() => {
        console.error = originalConsoleError;
    });

    test("It can work with useTranslate hook", () => {
        const store = bootStore({
            "Hello :name": "Hi there, :name !",
        });

        const SomeComponent = () => {
            const translate = useTranslate();
            return translate("Hello :name", { name: "Foo" });
        };

        const str = renderToStaticMarkup(
            <Provider store={store}>
                <IntlContextProvider>
                    <SomeComponent />
                </IntlContextProvider>
            </Provider>
        );
        expect(str).toBe("Hi there, Foo !");
    });
});

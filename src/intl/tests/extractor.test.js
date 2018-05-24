import { extract } from "../bin/extractor";

describe("extractor", () => {
    test("it can work with a simple string", () => {
        const content = "<Translate>Hello World</Translate>";

        expect(extract(content)).toEqual([{ line: 1, value: "Hello World" }]);
    });

    test("it can work with a simple string and multiple translations", () => {
        const content =
            "<div><Translate>Hello World</Translate><span><Translate>Test</Translate></span><Translate>Foo bar</Translate></div>";

        expect(extract(content)).toEqual([
            { line: 1, value: "Hello World" },
            { line: 1, value: "Test" },
            { line: 1, value: "Foo bar" },
        ]);
    });

    test("it can work with attributes", () => {
        const content = `<div><Translate hello="world">Hello World</Translate></div>`;

        expect(extract(content)).toEqual([
            {
                line: 1,
                value: "Hello World",
            },
        ]);
    });

    test("it can work with attributes having another translate", () => {
        const content = `<div><Translate hello={<Translate>Foo Bar</Translate>}>Hello World</Translate></div>`;

        expect(extract(content)).toEqual([{ line: 1, value: "Hello World" }, { line: 1, value: "Foo Bar" }]);
    });

    test("it can work on multiple lines", () => {
        const content = `
          <div>
            <Translate>Hello World</Translate>
          </div>
        `;

        expect(extract(content)).toEqual([
            {
                line: 3,
                value: "Hello World",
            },
        ]);
    });

    test("it can work with attributes", () => {
        const content = `
          <div>
            <Translate>
              Hello World
            </Translate>
          </div>`;

        expect(extract(content)).toEqual([
            {
                line: 3,
                value: "Hello World",
            },
        ]);
    });

    test("it can work with function", () => {
        const content = `<div>{translate("Hello World")}</div>`;

        expect(extract(content)).toEqual([
            {
                line: 1,
                value: "Hello World",
            },
        ]);
    });

    test("it can work with function within a function args", () => {
        const content = `<div>{ translate("Hello World", { baz: "ff", name: translate("Foo bar", {bar: translate("Gigel") } ) } )}</div>`;

        expect(extract(content)).toEqual([
            { line: 1, value: "Hello World" },
            { line: 1, value: "Foo bar" },
            { line: 1, value: "Gigel" },
        ]);
    });
});

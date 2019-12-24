import { extract } from "../src/extractor";

describe("extractor", () => {
    test("it can work with a simple string", () => {
        const content = "<Translate>Hello World</Translate>";

        expect(extract(content)).toEqual([{ line: 1, value: "Hello World", comment: "" }]);
    });

    test("it can work with a simple string and comment", () => {
        const content = "<Translate __comment='Some nice comment'>Hello World</Translate>";

        expect(extract(content)).toEqual([{ line: 1, value: "Hello World", comment: "Some nice comment" }]);
    });

    test("it can work with a simple string and multiple translations", () => {
        const content =
            "<div><Translate>Hello World</Translate><span><Translate>Test</Translate></span><Translate>Foo bar</Translate></div>";

        expect(extract(content)).toEqual([
            { line: 1, value: "Hello World", comment: "" },
            { line: 1, value: "Test", comment: "" },
            { line: 1, value: "Foo bar", comment: "" },
        ]);
    });

    test("it can work with attributes", () => {
        const content = `<div><Translate hello="world">Hello World</Translate></div>`;

        expect(extract(content)).toEqual([
            {
                line: 1,
                value: "Hello World",
                comment: "",
            },
        ]);
    });

    test("it can work with attributes having another translate", () => {
        const content = `<div><Translate hello={<Translate __comment="Foo Comment">Foo Bar</Translate>}>Hello World</Translate></div>`;

        expect(extract(content)).toEqual([
            { line: 1, value: "Hello World", comment: "" },
            { line: 1, value: "Foo Bar", comment: "Foo Comment" },
        ]);
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
                comment: "",
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
                comment: "",
            },
        ]);
    });

    test("it can work with function", () => {
        const content = `<div>{translate("Hello World")}</div>`;

        expect(extract(content)).toEqual([
            {
                line: 1,
                value: "Hello World",
                comment: "",
            },
        ]);
    });

    test("it can work with function and comment", () => {
        const content = `<div>{translate("Hello World", {}, 'Some comment')}</div>`;

        expect(extract(content)).toEqual([
            {
                line: 1,
                value: "Hello World",
                comment: "Some comment",
            },
        ]);
    });

    test("it can work with function within a function args", () => {
        const content = `<div>{ translate("Hello World", { baz: "ff", name: translate("Foo bar", {bar: translate("Gigel") }, "Foo Bar Comment" ) } )}</div>`;

        expect(extract(content)).toEqual([
            { line: 1, value: "Hello World", comment: "" },
            { line: 1, value: "Foo bar", comment: "Foo Bar Comment" },
            { line: 1, value: "Gigel", comment: "" },
        ]);
    });

    test("it can work with a unicode chars", () => {
        const content = "<Translate>Hello &#1779; World</Translate>";

        expect(extract(content)).toEqual([{ line: 1, value: "Hello &#1779; World", comment: "" }]);
    });

    test("it can work with apostrophes", () => {
        const content = `<Translate>{"Don't do it"}</Translate>`;

        expect(extract(content)).toEqual([{ line: 1, value: "Don't do it", comment: "" }]);
    });

    test("it can work with apostrophes", () => {
        const content = `<Translate>Don't do it</Translate>`;

        expect(extract(content)).toEqual([{ line: 1, value: "Don't do it", comment: "" }]);
    });

    test("it can work with apostrophes 2", () => {
        const content = `<Translate>{"Don't do it"}</Translate>`;

        expect(extract(content)).toEqual([{ line: 1, value: "Don't do it", comment: "" }]);
    });
});

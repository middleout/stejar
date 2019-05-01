const path = require("path");
const fs = require("fs");
const camelCase = require("@stejar/utils/es/camelCase");
const mkDirByPathSync = require("@stejar/utils/es/mkDirByPathSync");

let reducerTpl = `import typeToReducer from "type-to-reducer";

export const EXAMPLE_ACTION = "@app/_NAME_/EXAMPLE";

const defaultState = {
    exampleProp: "foo"
};

export const _NAME_Reducer = typeToReducer(
    {
        [EXAMPLE_ACTION]: handleExampleAction,
    },
    defaultState
);

function handleExampleAction(state, action) {
    return { ...state, ...action.payload };
}`;

let selectorsTpl = `import { createSelector } from "reselect";
import { $_NAME_ } from "./coreSelectors";

export const $exampleSelector = createSelector(
    $stateSliceSelector,
    stateSlice => stateSlice.exampleProp
);`;

module.exports = {
    command: "make:reducer <name>",
    callback: name => {
        name = camelCase(name)
            .replace("Reducer", "")
            .replace("reducer", "")
            .replace("Selector", "")
            .replace("selector", "")
            .replace("Selectors", "")
            .replace("selectors", "");

        const basePath = path.resolve(path.join("app", "redux"));
        mkDirByPathSync(path.join(basePath, "reducers"));
        mkDirByPathSync(path.join(basePath, "selectors"));

        reducerTpl = reducerTpl.replace(/_NAME_/g, name);
        selectorsTpl = selectorsTpl.replace(/_NAME_/g, name);
        fs.writeFileSync(path.join(basePath, "reducers", `${name}Reducer.js`), reducerTpl);
        fs.writeFileSync(path.join(basePath, "selectors", `${name}Selectors.js`), selectorsTpl);
    },
};

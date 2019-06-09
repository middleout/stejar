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
import { $_NAME_ } from "./../../app/selectors/appSelectors";

export const $exampleSelector = createSelector(
    $_NAME_,
    stateSlice => stateSlice.exampleProp
);`;

let actionsTpl = `import { EXAMPLE_ACTION } from "../reducers/_NAME_Reducer";

export function exampleAction(payload) {
    return (dispatch, getState, thunkOptions) => {
        dispatch({
            type: EXAMPLE_ACTION,
            payload,
        });
    }       
}`;

module.exports = {
    command: "make:redux <name>",
    option: ["-m, --module <module>", "create the component in this module", "app"],
    callback: (name, { module }) => {
        name = camelCase(name)
            .replace("Reducer", "")
            .replace("reducer", "")
            .replace("Selector", "")
            .replace("selector", "")
            .replace("Selectors", "")
            .replace("selectors", "")
            .replace("Actions", "")
            .replace("actions", "");

        const basePath = path.resolve(path.join("src", "modules", module, "redux"));
        mkDirByPathSync(path.join(basePath, "reducers"));
        mkDirByPathSync(path.join(basePath, "actions"));
        mkDirByPathSync(path.join(basePath, "selectors"));

        reducerTpl = reducerTpl.replace(/_NAME_/g, name);
        selectorsTpl = selectorsTpl.replace(/_NAME_/g, name);
        actionsTpl = actionsTpl.replace(/_NAME_/g, name);
        fs.writeFileSync(path.join(basePath, "reducers", `${name}Reducer.js`), reducerTpl);
        fs.writeFileSync(path.join(basePath, "selectors", `${name}Selectors.js`), selectorsTpl);
        fs.writeFileSync(path.join(basePath, "actions", `${name}Actions.js`), actionsTpl);
    },
};

import { configure } from "@storybook/react";
import { setDefaults } from "react-storybook-addon-props-combinations";

function loadStories() {
    require("../stories");
}

setDefaults();

configure(loadStories, module);

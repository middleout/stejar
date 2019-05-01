import { createElement, Fragment } from "react";
import { withTranslate } from "./withTranslate";

function TranslateComponent({ __, children, ...args }) {
    let translated = __(children, args);

    let list = [];
    Object.keys(args).forEach(name => {
        // Any other non object value has already been substituted
        if (typeof args[name] !== "object") {
            return;
        }

        list.push(args[name]);
        translated = translated.replace("%(" + name + ")", "__REACT__");
    });

    const result = [];
    const parts = translated.split("__REACT__");
    parts.forEach((part, idx) => {
        result.push(createElement(Fragment, { key: `part_${idx}` }, part));
        result.push(createElement(Fragment, { key: `item_${idx}` }, list.shift()));
    });

    if (result.length > 0) {
        return result;
    }

    return translated;
}

export const Translate = withTranslate(TranslateComponent);

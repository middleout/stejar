import { createElement, Fragment } from "react";
import { withTranslate } from "./withTranslate";

function Translated({ translate, children, ...args }) {
    const translationParams = {};
    Object.keys(args).forEach(name => {
        translationParams[name] = "<" + name + ">";
    });

    let translated = translate(children, translationParams);

    let idx = 0;
    const result = [];
    Object.keys(translationParams).forEach(name => {
        idx++;
        const parts = translated.split(translationParams[name]);
        if (parts.length > 1) {
            result.push(createElement(Fragment, { key: `left_key_${idx}` }, parts[0]));
            result.push(createElement(Fragment, { key: `value_${idx}` }, args[name]));
            result.push(createElement(Fragment, { key: `right_key_${idx}` }, parts[1]));
        }
    });

    if (result.length > 0) {
        return result;
    }

    return createElement(Fragment, {}, translated);
}

export const Translate = withTranslate(Translated);

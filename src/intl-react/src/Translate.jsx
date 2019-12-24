import { createElement, Fragment } from "react";
import { withTranslate } from "./withTranslate";

function Translated({ translate, children, dangerous = false, dangerousEl = "span", ...args }) {
    const translationParams = {};
    Object.keys(args).forEach(name => {
        translationParams[name] = "<" + name + ">";
    });

    let translated = translate(children, translationParams);

    let idx = 0;
    const result = [];
    let data = [];
    let variables = [];
    let whatToSplit = translated;
    Object.keys(translationParams).forEach(name => {
        const parts = whatToSplit.split(translationParams[name]);
        if (parts.length > 1) {
            data.push(parts[0]);
            variables.push(name);
            whatToSplit = parts[1];
        }
    });
    data.push(whatToSplit);

    data.forEach((part, offset) => {
        if (dangerous) {
            result.push(createElement(dangerousEl, { key: `part_${idx}`, dangerouslySetInnerHTML: { __html: part } }));
            if (variables[offset]) {
                result.push(
                    createElement(dangerousEl, {
                        key: `translation_${idx}`,
                        dangerouslySetInnerHTML: { __html: args[variables[offset]] },
                    })
                );
            }
        } else {
            result.push(createElement(Fragment, { key: `part_${idx}` }, part));
            if (variables[offset]) {
                result.push(createElement(Fragment, { key: `translation_${idx}` }, args[variables[offset]]));
            }
        }
    });

    if (result.length > 0) {
        return result;
    }

    if (dangerous) {
        return createElement(dangerousEl, { dangerouslySetInnerHTML: { __html: translated } });
    }

    return createElement(Fragment, {}, translated);
}

export const Translate = withTranslate(Translated);

import { createElement, Fragment } from "react";
import { withTranslate } from "./withTranslate";

function Translated({ translate, children, dangerous = false, dangerousEl = "span", ...args }) {
    const params = {};
    const translationParams = {};
    Object.keys(args).forEach(name => {
        if (typeof args[name] !== "string" && typeof args[name] !== "number") {
            translationParams[name] = "<" + name + ">";
            params[name] = "<" + name + ">";
        } else {
            params[name] = args[name];
        }
    });

    let translated = translate(children, params);
    const paramsInside = translated.match(/<([^>]+)>/g) || [];

    const result = [];
    let data = [];
    let variables = [];
    let whatToSplit = translated;
    paramsInside.forEach(key => {
        const name = key.replace("<", "").replace(">", "");
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
            result.push(
                createElement(dangerousEl, { key: `part_${offset}`, dangerouslySetInnerHTML: { __html: part } })
            );
            if (variables[offset]) {
                result.push(
                    createElement(dangerousEl, {
                        key: `translation_${offset}`,
                        dangerouslySetInnerHTML: { __html: args[variables[offset]] },
                    })
                );
            }
        } else {
            result.push(createElement(Fragment, { key: `part_${offset}` }, part));
            if (variables[offset]) {
                result.push(createElement(Fragment, { key: `translation_${offset}` }, args[variables[offset]]));
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

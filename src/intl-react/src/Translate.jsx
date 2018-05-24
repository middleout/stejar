import React from "react";
import { withTranslate } from "./withTranslate";

function _Translate({ __, children, ...args }) {
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
        result.push(<span key={`part_${idx}`}>{part}</span>);
        result.push(<span key={`item_${idx}`}>{list.shift()}</span>);
    });

    if (result.length > 0) {
        return result;
    }

    return translated;
}

export const Translate = withTranslate(_Translate);

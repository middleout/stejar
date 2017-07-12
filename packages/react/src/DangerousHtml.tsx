import { HTMLProps } from "react";
import DOM from "react-dom-factories";

export interface DangerousHtmlProps extends HTMLProps<any> {
    element?: string | "span";
}

/**
 * @param props
 * @returns {any}
 * @constructor
 */
export function DangerousHtml(props: DangerousHtmlProps) {
    const newProps: any = { ...props };
    (newProps as any).dangerouslySetInnerHTML = {
        __html: props.children as string,
    };
    delete newProps.children;
    const element = newProps.element;
    delete newProps.element;
    if (!(newProps as any).className) {
        (newProps as any).className = "dangerousHtml";
    } else {
        (newProps as any).className += " dangerousHtml";
    }
    return DOM[element || "span"](newProps);
}

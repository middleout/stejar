import DOM from "react-dom-factories";

/**
 * @param props
 * @returns {any}
 * @constructor
 */
export function DangerousHtml(props: any) {
    const newProps: any = { ...props };
    (newProps as any).dangerouslySetInnerHTML = {
        __html: props.children as string,
    };
    delete newProps.children;
    const type = newProps.type;
    delete newProps.type;
    if (!(newProps as any).className) {
        (newProps as any).className = "dangerousHtml";
    } else {
        (newProps as any).className += " dangerousHtml";
    }
    return DOM[type || "span"](newProps);
}

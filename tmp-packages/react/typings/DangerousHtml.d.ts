import { HTMLProps } from "react";
export interface DangerousHtmlProps extends HTMLProps<any> {
    element?: string | "span";
}
/**
 * @param props
 * @returns {any}
 * @constructor
 */
export declare function DangerousHtml(props: DangerousHtmlProps): any;

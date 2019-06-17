import React from "react";
import { Link } from "./Link";

export function AnchorLink(props) {
    return <Link {...props} render={(children, ...props) => <a {...props}>{children}</a>} />;
}

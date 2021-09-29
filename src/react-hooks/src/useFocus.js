import { useEffect, useRef } from "react";

export default function useFocus(focusOnMount = true, currentRef = null) {
    const htmlElRef = useRef(currentRef);
    const setFocus = () => htmlElRef.current && htmlElRef.current.focus();

    useEffect(() => {
        if (!focusOnMount) {
            return;
        }

        if (htmlElRef.current) {
            htmlElRef.current.focus();
        }
    }, [htmlElRef.current]);

    return [setFocus, htmlElRef];
}

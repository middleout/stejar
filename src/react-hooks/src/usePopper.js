import { useLayoutEffect, useRef } from "react";
import { createPopper } from "@popperjs/core/lib/popper.js";

export function usePopper(options = {}) {
    const ourReferenreRef = useRef();
    const referenceRef = options.referenceRef ? options.referenceRef : ourReferenreRef;
    const popperRef = useRef(null);
    const arrowRef = useRef(null);
    const popperInstanceRef = useRef(null);

    const buildOptions = options => ({
        ...options,
        modifiers: [...(options.modifiers || []), { name: "arrow", options: { element: arrowRef.current } }],
    });

    useLayoutEffect(() => {
        const popperInstance = createPopper(referenceRef.current, popperRef.current, buildOptions(options));

        popperInstanceRef.current = popperInstance;

        return () => {
            popperInstance.destroy();
        };
    }, []);

    useLayoutEffect(() => {
        popperInstanceRef.current.setOptions(buildOptions(options));
        popperInstanceRef.current.update();
    }, [options]);

    return {
        reference: referenceRef,
        popper: popperRef,
        arrow: arrowRef,
        popperInstanceRef: popperInstanceRef,
    };
}

import { useCallback, useEffect, useRef } from "react";

export default function useIfMounted() {
    const isMounted = useRef(true);
    const cb = useCallback((callback) => {
        if (!isMounted.current) {
            return;
        }

        callback();
    }, []);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    return cb;
}

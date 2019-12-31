import { useEffect, useRef } from "react";

export const useComponentWillMount = func => {
    const willMount = useRef(true);

    if (willMount.current) {
        func();
    }

    useEffect(() => {
        willMount.current = false;
    }, []);
};

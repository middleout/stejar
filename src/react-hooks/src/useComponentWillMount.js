import { useEffect, useRef } from "react";

export default function useComponentWillMount(func) {
    const willMount = useRef(true);

    if (willMount.current) {
        func();
    }

    useEffect(() => {
        willMount.current = false;
    }, []);
}

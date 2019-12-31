import { useEffect, useState } from "react";
import throttle from "lodash.throttle";

export function useScrollPosition(throttleInterval = 0) {
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        let last_known_scroll_position = 0;
        let ticking = false;
        const handleScroll = throttle(
            () => {
                last_known_scroll_position = window.scrollY;

                if (!ticking) {
                    window.requestAnimationFrame(function() {
                        setScrollPosition(last_known_scroll_position);
                        ticking = false;
                    });

                    ticking = true;
                }
            },
            throttleInterval,
            { trailing: true, leading: true }
        );

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return scrollPosition;
}

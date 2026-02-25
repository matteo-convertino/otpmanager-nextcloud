import {useCallback, useEffect, useRef} from "react";
import type {LottieRefCurrentProps} from "lottie-react";

export default function useLottie(speed = 0.5) {
    const lottieRef = useRef<LottieRefCurrentProps | null>(null);

    const onDOMLoaded = useCallback(() => {
        const animation = lottieRef.current;
        if (!animation) return;

        animation.setSpeed(speed);

        if (typeof window !== "undefined") {
            const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            if (!reduceMotion) animation.play();
        } else {
            animation.play();
        }
    }, [speed]);

    useEffect(() => {
        if (typeof document === "undefined") return;

        const onVisibilityChange = () => {
            const animation = lottieRef.current;
            if (!animation) return;

            if (document.hidden) {
                animation.pause();
            } else {
                const reduceMotion = typeof window !== "undefined"
                    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                if (!reduceMotion) {
                    animation.play();
                }
            }
        };

        document.addEventListener("visibilitychange", onVisibilityChange);
        return () => document.removeEventListener("visibilitychange", onVisibilityChange);
    }, []);

    return {lottieRef, onDOMLoaded};
}

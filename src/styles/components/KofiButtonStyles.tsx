import {keyframes} from "@emotion/react";
import {createStyles} from "@mantine/core";

export const kofiWiggle = keyframes({
    "0%": {
        transform: "rotate(0) scale(1)",
    },
    "15%": {
        transform: "rotate(0) scale(1.12)",
    },
    "20%": {
        transform: "rotate(0) scale(1.1)",
    },
    "24%": {
        transform: "rotate(-10deg) scale(1.1)",
    },
    "28%": {
        transform: "rotate(10deg) scale(1.1)",
    },
    "32%": {
        transform: "rotate(-10deg) scale(1.1)",
    },
    "36%": {
        transform: "rotate(10deg) scale(1.1)",
    },
    "40%": {
        transform: "rotate(0) scale(1)",
    },
    "100%": {
        transform: "rotate(0) scale(1)",
    },
});

export const useStyles = createStyles(() => ({
    kofiIcon: {
        animation: `${kofiWiggle} 3s infinite 0.5s`,
    },
}));

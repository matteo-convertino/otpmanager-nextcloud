import {createStyles} from "@mantine/core";

export const useStyles = createStyles(() => ({
    cardSpotlight: {
        position: "relative",
        borderRadius: "inherit",
        backgroundColor: "transparent",
        height: "inherit",
        overflow: "hidden",
        boxSizing: "border-box",
        "--mouse-x": "50%",
        "--mouse-y": "50%",
        "--spotlight-color": "rgba(255, 255, 255, 0.05)",

        "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
                "radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 80%)",
            opacity: 0,
            transition: "opacity 0.5s ease",
            pointerEvents: "none",
        },

        "&:hover::before, &:focus-within::before": {
            opacity: 0.6,
        },
    },
}));

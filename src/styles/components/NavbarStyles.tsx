import {createStyles, getStylesRef} from "@mantine/core";

export const navbarStyles = createStyles((theme, _params) => {
    const icon = getStylesRef("icon");

    return {
        header: {
            borderBottom: `1px solid ${
                theme.colorScheme === "dark"
                    ? theme.colors.dark[4]
                    : theme.colors.gray[2]
            }`,
            paddingTop: 0,
            paddingRight: 0,
            paddingBottom: theme.spacing.md,

            [theme.fn.largerThan("md")]: {
                marginBottom: theme.spacing.md,
            },

            [theme.fn.smallerThan("md")]: {
                margin: theme.spacing.md,
            },
        },

        footer: {
            paddingTop: theme.spacing.md,
            marginTop: theme.spacing.md,
            borderTop: `1px solid ${
                theme.colorScheme === "dark"
                    ? theme.colors.dark[4]
                    : theme.colors.gray[2]
            }`,
        },

        link: {
            ...theme.fn.focusStyles(),
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            fontSize: theme.fontSizes.sm,
            color:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[1]
                    : theme.colors.gray[7],
            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
            borderRadius: theme.radius.sm,
            fontWeight: 500,

            "&:hover": {
                cursor: "pointer",
                backgroundColor:
                    theme.colorScheme === "dark"
                        ? theme.colors.dark[6]
                        : theme.colors.gray[0],
                color: theme.colorScheme === "dark" ? theme.white : theme.black,

                [`& .${icon}`]: {
                    color: theme.colorScheme === "dark" ? theme.white : theme.black,
                },
            },
        },

        linkIcon: {
            ref: icon,
            color:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[2]
                    : theme.colors.gray[6],
            marginRight: theme.spacing.sm,
        },

        linkActive: {
            "&, &:hover": {
                backgroundColor: theme.fn.variant({
                    variant: "light",
                    color: theme.primaryColor,
                }).background,
                color: theme.fn.variant({variant: "light", color: theme.primaryColor})
                    .color,
                [`& .${icon}`]: {
                    color: theme.fn.variant({
                        variant: "light",
                        color: theme.primaryColor,
                    }).color,
                },
            },
        },

        innerLink: {
            textDecoration: "none",
            padding: `${theme.spacing.xs} 0 ${theme.spacing.xs} ${theme.spacing.xl}`,
            marginLeft: theme.spacing.xl,
            borderLeft: `1px solid ${
                theme.colorScheme === "dark"
                    ? theme.colors.dark[4]
                    : theme.colors.gray[3]
            }`,
        },
    };
});

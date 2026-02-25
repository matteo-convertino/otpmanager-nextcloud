import {Button, Text} from "@mantine/core";
import kofiCup from "@/assets/kofi_cup.png";
import {useStyles} from "@/styles/components/KofiButtonStyles.tsx";

export default function KofiButton({
                                       username,
                                       label = "Support this project",
                                       title = "",
                                   }: {
    username: string;
    label?: string;
    title?: string;
}) {
    const {classes} = useStyles();
    const profileUrl = `https://ko-fi.com/${username}`;

    return (
        <Button
            component="a"
            href={profileUrl}
            target="_blank"
            rel="noreferrer noopener external"
            title={title}
            leftIcon={
                <img
                    src={kofiCup}
                    alt="Kofi Cup"
                    height={20}
                    className={classes.kofiIcon}
                />
            }
            variant="gradient"
            gradient={{from: "yellow.2", to: "yellow.4"}}
            fullWidth={true}
        >
            <Text c="yellow.9">{label}</Text>
        </Button>
    );
}

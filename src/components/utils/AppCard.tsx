import {Card, Button, Text, Group, Image, Badge} from "@mantine/core";
import React from "react";

type AppCardButton = {
    text: string,
    link?: string,
    disabled?: boolean
}

export function AppCard(
    {
        title,
        description,
        badges,
        image,
        buttons,
    }: {
        title: string,
        description: string,
        badges: { text: string, color?: string }[],
        image: string,
        buttons: AppCardButton[],
    }) {

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
                <Image src={image} mt="md" height={160} fit="contain"/>
            </Card.Section>

            <Group position="apart" mt="md" mb="xs">
                <Text weight={500}>{title}</Text>
                <Group spacing="xs">
                    {badges.map((badge, i) => (
                        <Badge
                            key={i}
                            color={badge.color}
                            variant="light"
                        >
                            {badge.text}
                        </Badge>
                    ))}
                </Group>
            </Group>

            <Text size="sm" color="dimmed" align="justify">
                {description}
            </Text>

            {buttons.map((button, i) => (
                <Button
                    key={`${button.text}-${i}`}
                    onClick={button.disabled ? (event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault() : undefined}
                    component="a"
                    href={button.link ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant={i === 0 ? "light" : "subtle"}
                    color="blue"
                    fullWidth
                    mt="md"
                    radius="md"
                    disabled={button.disabled}
                    sx={{"&[data-disabled]": {pointerEvents: "all"}}}
                >
                    {button.text}
                </Button>
            ))}
        </Card>
    );
}

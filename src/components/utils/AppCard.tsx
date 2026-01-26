import {Card, Button, Text, Group, Image, Badge} from "@mantine/core";
import React from "react";

export function AppCard(
    {
        title,
        description,
        badges,
        image,
        buttonText,
        link = "#",
        buttonDisabled = false,
    }: {
        title: string,
        description: string,
        badges: { text: string, color?: string }[],
        image: string,
        buttonText: string,
        link?: string,
        buttonDisabled?: boolean
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

            <Button
                onClick={buttonDisabled ? (event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault() : undefined}
                component="a"
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                variant="light"
                color="blue"
                fullWidth
                mt="md"
                radius="md"
                disabled={buttonDisabled}
                sx={{"&[data-disabled]": {pointerEvents: "all"}}}
            >
                {buttonText}
            </Button>
        </Card>
    );
}

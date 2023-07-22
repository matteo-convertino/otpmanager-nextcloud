import React from "react";

import { Card, Button, Text, Group, Image, Badge } from "@mantine/core";

export function AppCard({
  title,
  description,
  badgeText,
  image,
  buttonText,
  link = "#",
  buttonDisabled = false,
}) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image src={image} mt="md" height={160} fit="contain" />
      </Card.Section>

      <Group position="apart" mt="md" mb="xs">
        <Text weight={500}>{title}</Text>

        <Badge color="blue" variant="light">
          {badgeText}
        </Badge>
      </Group>

      <Text size="sm" color="dimmed" align="justify">
        {description}
      </Text>

      <Button
        component="a"
        href={link}
        variant="light"
        color="blue"
        fullWidth
        mt="md"
        radius="md"
        disabled={buttonDisabled}
        sx={{ "&[data-disabled]": { pointerEvents: "all" } }}
      >
        {buttonText}
      </Button>
    </Card>
  );
}

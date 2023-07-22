import React from "react";

import { Select, Stack, TextInput, Grid, Group, Button } from "@mantine/core";
import { IconAbc, IconShieldLock, IconKey } from "@tabler/icons-react";

export default function CreateEditContent({
  form,
  textSubmitButton,
  iconSumbitButton,
  isSecretKeyDisabled,
}) {
  return (
    <Stack spacing="xl">
      <TextInput
        label="Account name"
        withAsterisk
        rightSection={<IconAbc />}
        {...form.getInputProps("name")}
      />
      <TextInput
        label="Account issuer"
        rightSection={<IconShieldLock />}
        {...form.getInputProps("issuer")}
      />
      <TextInput
        disabled={isSecretKeyDisabled}
        label="Secret key"
        withAsterisk
        rightSection={<IconKey />}
        {...form.getInputProps("secret")}
      />
      <Grid grow>
        <Grid.Col span={8}>
          <Select
            label="Type of code"
            defaultValue="totp"
            data={[
              { value: "totp", label: "Based on time (TOTP)" },
              { value: "hotp", label: "Based on counter (HOTP)" },
            ]}
            {...form.getInputProps("type")}
          />
        </Grid.Col>
        {form.values.type == "totp" && (
          <Grid.Col span={4}>
            <Select
              label="Interval"
              defaultValue="30"
              data={[
                { value: "30", label: "30s" },
                { value: "45", label: "45s" },
                { value: "60", label: "60s" },
              ]}
              {...form.getInputProps("period")}
            />
          </Grid.Col>
        )}
      </Grid>
      <Grid grow justify="space-between">
        <Grid.Col span={3}>
          <Select
            label="Algorithm"
            defaultValue="SHA1"
            data={[
              { value: "SHA1", label: "SHA1" },
              { value: "SHA256", label: "SHA256" },
              { value: "SHA512", label: "SHA512" },
            ]}
            {...form.getInputProps("algorithm")}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <Select
            label="Digits"
            defaultValue="6"
            data={[
              { value: "6", label: "6" },
              { value: "4", label: "4" },
            ]}
            {...form.getInputProps("digits")}
          />
        </Grid.Col>
      </Grid>

      <Group position="right">
        <Button
          styles={{
            icon: {
              display: "inline",
            },
          }}
          rightIcon={iconSumbitButton}
          type="submit"
        >
          {textSubmitButton}
        </Button>
      </Group>
    </Stack>
  );
}

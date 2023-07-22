import React from "react";
import { Text, Grid, Stack, Divider } from "@mantine/core";

import { getAlgorithm } from "../utils/getAlgorithm";

export function AsideContent({ otp }) {
  return (
    <>
      <Divider mb="lg" />

      <Stack spacing="xl">
        <Grid grow justify="space-between" sx={{ backgroundColor: "" }}>
          <Grid.Col span={3}>Name</Grid.Col>
          <Grid.Col span={3}>
            <Text ta="right" fs="italic" c="dimmed">
              {otp.name}
            </Text>
          </Grid.Col>
        </Grid>

        <Grid grow justify="space-between">
          <Grid.Col span={3}>Issuer</Grid.Col>
          <Grid.Col span={3}>
            <Text ta="right" fs="italic" c="dimmed">
              {otp.issuer}
            </Text>
          </Grid.Col>
        </Grid>

        <Grid grow justify="space-between">
          <Grid.Col span={3}>Period</Grid.Col>
          <Grid.Col span={3}>
            <Text ta="right" fs="italic" c="dimmed">
              {otp.period}s
            </Text>
          </Grid.Col>
        </Grid>

        <Grid grow justify="space-between">
          <Grid.Col span={3}>Digits</Grid.Col>
          <Grid.Col span={3}>
            <Text ta="right" fs="italic" c="dimmed">
              {otp.digits}
            </Text>
          </Grid.Col>
        </Grid>

        <Grid grow justify="space-between">
          <Grid.Col span={3}>Algorithm</Grid.Col>
          <Grid.Col span={3}>
            <Text ta="right" fs="italic" c="dimmed">
              {getAlgorithm(otp.algorithm)}
            </Text>
          </Grid.Col>
        </Grid>

        <Grid grow justify="space-between">
          <Grid.Col span={3}>Type</Grid.Col>
          <Grid.Col span={3}>
            <Text ta="right" fs="italic" c="dimmed" tt="uppercase">
              {otp.type}
            </Text>
          </Grid.Col>
        </Grid>

        {otp.type == "hotp" && (
          <Grid grow justify="space-between">
            <Grid.Col span={3}>Counter</Grid.Col>
            <Grid.Col span={3}>
              <Text ta="right" fs="italic" c="dimmed">
                {otp.counter}
              </Text>
            </Grid.Col>
          </Grid>
        )}

        <Grid grow justify="space-between">
          <Grid.Col span={3}>Created At</Grid.Col>
          <Grid.Col span={3}>
            <Text ta="right" fs="italic" c="dimmed">
              {otp.created_at}
            </Text>
          </Grid.Col>
        </Grid>

        <Grid grow justify="space-between">
          <Grid.Col span={3}>Updated At</Grid.Col>
          <Grid.Col span={3}>
            <Text ta="right" fs="italic" c="dimmed">
              {otp.updated_at}
            </Text>
          </Grid.Col>
        </Grid>

        {otp.deleted_at != null && (
          <Grid grow justify="space-between">
            <Grid.Col span={3}>Deleted At</Grid.Col>
            <Grid.Col span={3}>
              <Text ta="right" fs="italic" c="dimmed">
                {otp.deleted_at}
              </Text>
            </Grid.Col>
          </Grid>
        )}
      </Stack>
    </>
  );
}

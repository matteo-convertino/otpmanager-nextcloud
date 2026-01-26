import {Grid, Stack, Text} from "@mantine/core";
import {useSidebarStore} from "@/context/useSidebarStore.ts";
import {OtpType} from "@/utils/enum/otpType.ts";


export default function AsideInfo() {
    const {showAsideInfo: otp} = useSidebarStore();

    return otp === undefined ? <></> : (
        <>
            <Stack spacing="xl">
                <Grid grow justify="space-between" sx={{backgroundColor: ""}}>
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
                            {otp.algorithm}
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

                {otp.type === OtpType.HOTP && (
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
                            {otp.createdAt.toString()}
                        </Text>
                    </Grid.Col>
                </Grid>

                <Grid grow justify="space-between">
                    <Grid.Col span={3}>Updated At</Grid.Col>
                    <Grid.Col span={3}>
                        <Text ta="right" fs="italic" c="dimmed">
                            {otp.updatedAt.toString()}
                        </Text>
                    </Grid.Col>
                </Grid>

                {otp.deletedAt != null && (
                    <Grid grow justify="space-between">
                        <Grid.Col span={3}>Deleted At</Grid.Col>
                        <Grid.Col span={3}>
                            <Text ta="right" fs="italic" c="dimmed">
                                {otp.deletedAt.toString()}
                            </Text>
                        </Grid.Col>
                    </Grid>
                )}

                {otp.isShared && (
                    <Grid grow justify="space-between">
                        <Grid.Col span={3}>Expired At</Grid.Col>
                        <Grid.Col span={3}>
                            <Text ta="right" fs="italic" c="dimmed">
                                {otp.expiredAt === null ? "Never expires" : otp.expiredAt.toString()}
                            </Text>
                        </Grid.Col>
                    </Grid>
                )}
            </Stack>
        </>
    );
}

import {Button, Grid, Group, NumberInput, Select, Stack, TextInput} from "@mantine/core";
import {IconAbc, IconKey, IconShieldLock} from "@tabler/icons-react";
import type {UseFormReturnType} from "@mantine/form";
import type {AccountRequestSchemaForm} from "@/dto/request/AccountRequestDTO.ts";
import type {ReactNode} from "react";
import {OtpType} from "@/utils/enum/otpType.ts";
import {OtpPeriod} from "@/utils/enum/otpPeriod.ts";
import {OtpAlgorithm} from "@/utils/enum/otpAlgorithm.ts";
import {OtpDigits} from "@/utils/enum/otpDigits.ts";

export default function CreateEditContent(
    {
        form,
        textSubmitButton,
        iconSubmitButton,
        isEditing,
        isSharedAccount,
    }: {
        form: UseFormReturnType<AccountRequestSchemaForm>,
        textSubmitButton: string,
        iconSubmitButton: ReactNode,
        isEditing: boolean,
        isSharedAccount: boolean
    }) {
    return (
        <Stack spacing="xl">
            <TextInput
                label="Account name"
                withAsterisk
                rightSection={<IconAbc/>}
                {...form.getInputProps("name")}
            />
            <TextInput
                label="Account issuer"
                rightSection={<IconShieldLock/>}
                {...form.getInputProps("issuer")}
            />

            {!isSharedAccount && (
                <>
                    <TextInput
                        label="Secret key"
                        disabled={isEditing}
                        withAsterisk
                        rightSection={<IconKey/>}
                        {...form.getInputProps("secret")}
                    />
                    <Grid grow>
                        <Grid.Col span={7}>
                            <Select
                                label="Type of code"
                                defaultValue={OtpType.TOTP}
                                data={[
                                    {value: OtpType.TOTP, label: "Based on time (TOTP)"},
                                    {value: OtpType.HOTP, label: "Based on counter (HOTP)"},
                                ]}
                                {...form.getInputProps("type")}
                            />
                        </Grid.Col>
                        {form.values.type === OtpType.TOTP ? (
                            <Grid.Col span={5}>
                                <Select
                                    label="Interval"
                                    defaultValue={OtpPeriod.P30.toString()}
                                    data={[
                                        {value: OtpPeriod.P30.toString(), label: "30s"},
                                        {value: OtpPeriod.P45.toString(), label: "45s"},
                                        {value: OtpPeriod.P60.toString(), label: "60s"},
                                    ]}
                                    value={form.values.period.toString()}
                                    onChange={period => {
                                        if(period !== null) form.setFieldValue("period", parseInt(period));
                                    }}
                                />
                            </Grid.Col>
                        ) : (
                            <Grid.Col span={5}>
                                <NumberInput
                                    label="Counter"
                                    placeholder="Initial counter"
                                    min={0}
                                    disabled={isEditing}
                                    value={form.values.counter ?? ""}
                                    onChange={counter => {
                                        form.setFieldValue("counter", counter === "" ? null : counter);
                                    }}
                                />
                            </Grid.Col>
                        )}
                    </Grid>
                    <Grid grow justify="space-between">
                        <Grid.Col span={3}>
                            <Select
                                label="Algorithm"
                                defaultValue={OtpAlgorithm.SHA1}
                                data={[
                                    {value: OtpAlgorithm.SHA1, label: "SHA1"},
                                    {value: OtpAlgorithm.SHA256, label: "SHA256"},
                                    {value: OtpAlgorithm.SHA512, label: "SHA512"},
                                ]}
                                {...form.getInputProps("algorithm")}
                            />
                        </Grid.Col>
                        <Grid.Col span={3}>
                            <Select
                                label="Digits"
                                defaultValue={OtpDigits.D6.toString()}
                                data={[
                                    {value: OtpDigits.D6.toString(), label: "6"},
                                    {value: OtpDigits.D4.toString(), label: "4"},
                                ]}
                                value={form.values.digits.toString()}
                                onChange={digits => {
                                    if(digits !== null) form.setFieldValue("digits", parseInt(digits));
                                }}
                            />
                        </Grid.Col>
                    </Grid>
                </>
            )}

            <Group position="right">
                <Button
                    styles={{
                        icon: {
                            display: "inline",
                        },
                    }}
                    leftIcon={iconSubmitButton}
                    type="submit"
                >
                    {textSubmitButton}
                </Button>
            </Group>
        </Stack>
    );
}

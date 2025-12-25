import {useDisclosure} from "@mantine/hooks";
import {useState} from "react";

import {Box, Flex, PasswordInput, Popover, Progress,} from "@mantine/core";
import {type UseFormReturnType} from "@mantine/form";
import {getStrength, PasswordRequirement, requirements} from "@/components/password/PasswordRequirement.tsx";
import type {passwordCreateFormType} from "@/dto/utils/passwordFormCreateType.ts";
import type {passwordUpdateFormType} from "@/dto/utils/passwordFormUpdateType.ts";


export default function PasswordSaveForm({form, onSubmit, isUpdate}: {
    form: UseFormReturnType<passwordCreateFormType>, onSubmit: () => void, isUpdate: false
} | {
    form: UseFormReturnType<passwordUpdateFormType>, onSubmit: () => void, isUpdate: true
}) {
    const [popoverOpened, setPopoverOpened] = useState(false);
    const [visible, {toggle}] = useDisclosure(false);

    const checks = requirements.map((requirement, index) => (
        <PasswordRequirement
            key={index}
            label={requirement.label}
            verified={requirement.re.test(form.values.password)}
        />
    ));
    const strength = getStrength(form.values.password);
    const color = strength === 100 ? "teal" : strength > 50 ? "yellow" : "red";

    return (
        <Box>
            <form id="form" onSubmit={onSubmit}>
                <Flex justify="center" direction="column">
                    <Popover
                        opened={popoverOpened}
                        position="bottom"
                        width="calc(100% - 68px)"
                        shadow="md"
                    >
                        {isUpdate && (
                            <PasswordInput
                                required
                                label="Current Password"
                                mb="md"
                                placeholder="Insert your current password"
                                {...form.getInputProps("oldPassword")}
                            />
                        )}
                        <Popover.Target>
                            <Box
                                w="100%"
                                onFocusCapture={() => setPopoverOpened(true)}
                                onBlurCapture={() => setPopoverOpened(false)}
                            >
                                <PasswordInput
                                    required
                                    label="Password"
                                    placeholder={
                                        "Insert your" + (isUpdate ? " new " : " ") + "password"
                                    }
                                    visible={visible}
                                    onVisibilityChange={toggle}
                                    {...(form as any).getInputProps("password")}
                                />
                            </Box>
                        </Popover.Target>
                        <Popover.Dropdown>
                            <Progress color={color} value={strength} size={5} mb="xs"/>

                            {checks}
                        </Popover.Dropdown>
                    </Popover>
                    {!isUpdate && (
                        <>
                            <PasswordInput
                                required
                                label="Confirm Password"
                                placeholder={
                                    "Confirm your" + (isUpdate ? " new " : " ") + "password"
                                }
                                mt="md"
                                visible={visible}
                                onVisibilityChange={toggle}
                                {...form.getInputProps("confirmPassword")}
                            />
                        </>
                    )}
                </Flex>
            </form>
        </Box>
    );
}

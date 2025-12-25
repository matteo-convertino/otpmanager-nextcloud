import {useDisclosure} from "@mantine/hooks";
import {useCallback} from "react";

import {Box, Checkbox, Flex, PasswordInput,} from "@mantine/core";
import usePasswordCheckForm from "@/hooks/usePasswordCheckForm.tsx";


export default function PasswordCheckForm() {
    const [visible, {toggle}] = useDisclosure(false);
    const autoFocus = useCallback(
        (inputElement: HTMLElement | null): void => {
            inputElement && inputElement.focus();
        },
        [],
    );

    const {form, onSubmit} = usePasswordCheckForm();

    return (
        <Box>
            <form id="form" onSubmit={form.onSubmit((values) => onSubmit(values))}>
                <Flex justify="center" direction="column">
                    <Box
                        w="100%"
                    >
                        <PasswordInput
                            required
                            label="Password"
                            placeholder={
                                "Insert your password"
                            }
                            visible={visible}
                            onVisibilityChange={toggle}
                            ref={autoFocus}
                            {...form.getInputProps("password")}
                        />
                    </Box>

                    <Checkbox
                        label="Remember password"
                        mt="md"
                        {...form.getInputProps("savePassword")}
                    />
                </Flex>
            </form>
        </Box>
    );
}

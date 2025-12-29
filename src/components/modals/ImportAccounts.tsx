import {useState} from "react";

import {Alert, Anchor, Button, FileInput, Group, PasswordInput,} from "@mantine/core";
import {IconFileImport, IconInfoCircle,} from "@tabler/icons-react";
import useImportAccountsForm from "@/hooks/account/useImportAccountsForm.tsx";

export function ImportAccounts() {
    const [file, setFile] = useState<File | undefined>(undefined);
    const {form, onSubmit} = useImportAccountsForm({file: file});

    return (
        <>
            <Alert
                variant="light"
                color="blue"
                radius="md"
                title="Other way to import"
                icon={<IconInfoCircle/>}
            >
                If you're using <Anchor href="https://github.com/helloworld1/FreeOTPPlus" target="_blank">FreeOTP
                Plus</Anchor> and you want to import your accounts here, take
                a look at{" "}
                <Anchor href="https://github.com/matteo-convertino/otpmanager-nextcloud/issues/20#issue-2066571171"
                        target="_blank">
                    this script
                </Anchor>
                .
            </Alert>

            <FileInput
                label="Import file"
                placeholder="Click here to upload your .json file"
                accept="application/json"
                value={file}
                onChange={(f) => {
                    if (f !== null) setFile(f);
                }}
            />

            <PasswordInput
                label="Password"
                mb="md"
                description="Only if you are importing encrypted accounts"
                placeholder="Insert the password to decrypt"
                {...form.getInputProps("password")}
            />

            <Group position="right">
                <Button
                    styles={{
                        icon: {
                            display: "inline",
                        },
                    }}
                    rightIcon={<IconFileImport/>}
                    type="submit"
                    onClick={onSubmit}
                >
                    Import accounts
                </Button>
            </Group>
        </>
    );
}

import {useState} from "react";

import {Alert, Anchor, Button, FileInput, Group, List, PasswordInput,} from "@mantine/core";
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
                title="Migrate from other app"
                icon={<IconInfoCircle/>}
            >
                <List>
                    <List.Item>
                        <Anchor
                            href="https://gist.github.com/matteo-convertino/952c69a93a43243420d0a462e8111ea2"
                            target="_blank"
                        >
                            Stratum
                        </Anchor>
                    </List.Item>
                    <List.Item>
                        <Anchor
                            href="https://gist.github.com/matteo-convertino/f9720aca02d3c317710e97dd701456ec"
                            target="_blank"
                        >
                            Authy
                        </Anchor>
                    </List.Item>
                    <List.Item>
                        <Anchor
                            href="https://gist.github.com/matteo-convertino/39ed696ff5b462f27b7b7070f7a4753a"
                            target="_blank"
                        >
                            FreeOTP Plus
                        </Anchor>
                    </List.Item>
                    <List.Item>
                        <Anchor
                            href="https://gist.github.com/matteo-convertino/647bcc07a58408a5db6f9dc94ed052e6"
                            target="_blank"
                        >
                            LastPass Authenticator
                        </Anchor>
                    </List.Item>
                </List>
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
                    leftIcon={<IconFileImport/>}
                    type="submit"
                    onClick={onSubmit}
                >
                    Import accounts
                </Button>
            </Group>
        </>
    );
}

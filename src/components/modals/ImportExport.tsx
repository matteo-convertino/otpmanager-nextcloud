import {useState} from "react";

import {Box, Center, Modal, SegmentedControl, Stack} from "@mantine/core";
import {IconFileExport, IconFileImport} from "@tabler/icons-react";

import {ExportAccounts} from "./ExportAccounts";
import {ImportAccounts} from "./ImportAccounts";
import {useModalsStore} from "@/context/useModalsStore.ts";

export function ImportExport() {
    const [sectionValue, setSectionValue] = useState<"export" | "import">("import");
    const {showImportExport, setShowImportExport} = useModalsStore();

    return (
        <Modal
            opened={showImportExport}
            onClose={() => setShowImportExport(false)}
            title={sectionValue == "export" ? "Export Accounts" : "Import Accounts"}
            centered
        >
            <Stack spacing="xl">
                <SegmentedControl
                    value={sectionValue}
                    onChange={setSectionValue}
                    fullWidth
                    data={[
                        {
                            value: "import",
                            label: (
                                <Center>
                                    <IconFileImport size={16}/>
                                    <Box ml={10}>Import</Box>
                                </Center>
                            ),
                        },
                        {
                            value: "export",
                            label: (
                                <Center>
                                    <IconFileExport size={16}/>
                                    <Box ml={10}>Export</Box>
                                </Center>
                            ),
                        },
                    ]}
                />

                {sectionValue == "export" ? <ExportAccounts/> : <ImportAccounts/>}
            </Stack>
        </Modal>
    );
}

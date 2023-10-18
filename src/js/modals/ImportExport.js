import React, { useEffect, useState } from "react";

import {
  Box,
  Center,
  Modal,
  SegmentedControl,
  Stack
} from "@mantine/core";
import {
  IconFileExport,
  IconFileImport
} from "@tabler/icons-react";

import { ExportAccounts } from "./ExportAccounts";
import { ImportAccounts } from "./ImportAccounts";

export function ImportExport({
  showImportExport,
  setShowImportExport,
  accounts,
  setAccounts,
  setFetchState,
}) {
  const [sectionComponent, setSectionComponent] = useState(null);
  const [sectionValue, setSectionValue] = useState("import");

  useEffect(() => {
    if (sectionValue == "export")
      setSectionComponent(<ExportAccounts accounts={accounts} />);
    else if (sectionValue == "import")
      setSectionComponent(
        <ImportAccounts
          setAccounts={setAccounts}
          setFetchState={setFetchState}
          closeModal={closeModal}
        />
      );
  }, [sectionValue]);

  function closeModal() {
    setShowImportExport(false);
  }

  return (
    <Modal
      opened={showImportExport}
      onClose={() => closeModal()}
      title="Import Accounts"
      centered
    >
      <Stack spacing="xl">
        <SegmentedControl
          value={sectionValue}
          onChange={setSectionValue}
          data={[
            {
              value: "import",
              label: (
                <Center>
                  <IconFileImport size={16} />
                  <Box ml={10}>Import</Box>
                </Center>
              ),
            },
            {
              value: "export",
              label: (
                <Center>
                  <IconFileExport size={16} />
                  <Box ml={10}>Export</Box>
                </Center>
              ),
            },
          ]}
          fullWidth
        />

        {sectionComponent}
      </Stack>
    </Modal>
  );
}

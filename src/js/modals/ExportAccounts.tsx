import React, { useContext } from "react";

import { Box, Button, Group, Text } from "@mantine/core";
import {
  IconLock,
  IconLockOpen
} from "@tabler/icons-react";
import { SecretContext } from "./../context/SecretProvider";

export function ExportAccounts({ accounts }) {
  const [secret, setSecret] = useContext(SecretContext);

  function exportAccounts(encrypt) {
    let accountsToExport = accounts.map((e) => ({ ...e }));

    accountsToExport.forEach((account) => {
      if (!encrypt) account.secret = account.decryptedSecret;

      delete account.decryptedSecret;
      delete account.id;
      delete account.created_at;
      delete account.updated_at;
      delete account.deleted_at;
      delete account.user_id;
      delete account.position;
      delete account.code;
    });

    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(
        encrypt
          ? { accounts: accountsToExport, iv: secret.iv }
          : { accounts: accountsToExport }
      )
    )}`;

    const link = document.createElement("a");

    link.href = jsonString;
    link.download = encrypt
      ? "accounts_encrypted_secret.json"
      : "accounts_plain_secret.json";

    link.click();
  }

  return (
    <>
      <Text>Select how you want to export your accounts.</Text>
      <Box>
        <Text sx={{ display: "inline" }}>
          Choose based on your needs whether to export them securely
        </Text>{" "}
        <Text sx={{ display: "inline" }} fw={700}>
          with your encrypted secret key
        </Text>{" "}
        or{" "}
        <Text sx={{ display: "inline" }} fw={700}>
          totally unencrypted
        </Text>
      </Box>

      <Group position="right">
        <Button
          styles={{
            icon: {
              display: "inline",
            },
          }}
          rightIcon={<IconLock />}
          type="submit"
          onClick={() => exportAccounts(true)}
        >
          Encrypted Export
        </Button>

        <Button
          styles={{
            icon: {
              display: "inline",
            },
          }}
          rightIcon={<IconLockOpen />}
          type="submit"
          color="red"
          onClick={() => exportAccounts(false)}
        >
          Plain Secret Export
        </Button>
      </Group>
    </>
  );
}

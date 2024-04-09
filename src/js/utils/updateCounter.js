import { showNotification } from "@mantine/notifications";
import axios from "@nextcloud/axios";
import { generateOcsUrl } from "@nextcloud/router";
import { HOTP } from "otpauth";
import React from "react";

import { IconX } from "@tabler/icons-react";
import { getAlgorithm } from "./getAlgorithm";

export async function updateCounter(account, userId, setUpdateCounterState) {
  setUpdateCounterState(true);
  const url =
    account.unlocked === undefined
      ? "/apps/otpmanager/accounts/update-counter"
      : "/apps/otpmanager/share/update-counter";

  await axios
    .post(generateOcsUrl(url), {
      secret: account.secret,
    })
    .then((response) => {
      if (response.status === 200) {
        account.counter = response.data;

        let hotp = new HOTP({
          issuer: account.issuer,
          label: account.name,
          algorithm: getAlgorithm(account.algorithm),
          digits: account.digits,
          counter: account.counter,
          secret: account.decryptedSecret,
        });

        account.code = hotp.generate();
      } else {
        showNotification({
          color: "red",
          title: "Error",
          message:
            response.data.error ??
            "There was an error while incrementing counter",
          icon: <IconX size={16} />,
          autoClose: 2000,
        });
      }
    })
    .catch((e) => {
      showNotification({
        color: "red",
        title: "Error",
        message:
          e.response.data.error ??
          "There was an error while incrementing counter",
        icon: <IconX size={16} />,
        autoClose: 2000,
      });
    });

  setUpdateCounterState(false);
}

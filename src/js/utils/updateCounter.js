import { showNotification } from "@mantine/notifications";
import axios from "@nextcloud/axios";
import { generateUrl } from "@nextcloud/router";
import { HOTP } from "otpauth";
import React from "react";

import { IconX } from "@tabler/icons-react";
import { getAlgorithm } from "./getAlgorithm";

export async function updateCounter(account, setUpdateCounterState) {
  setUpdateCounterState(true);

  // reset counter to this value if it throws an error
  let oldValue = account.counter;

  account.counter += 1;

  const response = await axios.put(generateUrl("/apps/otpmanager/accounts"), {
    data: account,
  });

  if (response.data == "OK") {
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
    account.counter = oldValue;
    showNotification({
      color: "red",
      title: "Error",
      message:
        response.data.msg !== undefined
          ? response.data.msg
          : "Not able to generate new HOTP code for this account",
      icon: <IconX size={16} />,
      autoClose: 2000,
    });
  }
  setUpdateCounterState(false);
}

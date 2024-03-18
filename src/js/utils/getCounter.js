import { showNotification } from "@mantine/notifications";
import axios from "@nextcloud/axios";
import { generateUrl } from "@nextcloud/router";
import { HOTP } from "otpauth";
import React from "react";

import { IconX } from "@tabler/icons-react";
import { getAlgorithm } from "./getAlgorithm";

/*export async function getCounter(secret) {

  const response = await axios.get(generateUrl("/apps/otpmanager/accounts/get-counter/" + secret));

  return response.data;
}*/

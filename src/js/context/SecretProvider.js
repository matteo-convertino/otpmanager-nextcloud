import { showNotification } from "@mantine/notifications";
import axios from "@nextcloud/axios";
import { generateUrl } from "@nextcloud/router";
import { IconX } from "@tabler/icons-react";
import React, { createContext, useEffect, useState } from "react";
import { Secret } from "../model/Secret";

const initState = new Secret();

const SecretContext = createContext(initState);

const SecretContextProvider = ({ children }) => {
  const [state, setState] = useState(initState);

  return (
    <SecretContext.Provider value={[state, setState]}>
      {children}
    </SecretContext.Provider>
  );
};

export { SecretContext, SecretContextProvider };

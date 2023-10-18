import React from "react";

import { showNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";

const unsecuredCopyToClipboard = (text) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand("copy");
  } catch (err) {
    console.error("Unable to copy to clipboard", err);
  }
  document.body.removeChild(textArea);
};

/**
 * Copies the text passed as param to the system clipboard
 * Check if using HTTPS and navigator.clipboard is available
 * Then uses standard clipboard API, otherwise uses fallback
 */
const copy = (content) => {
  if (window.isSecureContext && navigator.clipboard) {
    navigator.clipboard.writeText(content);
  } else {
    unsecuredCopyToClipboard(content);
  }
  showNotification({
    id: "copy",
    color: "teal",
    icon: <IconCheck size={16} />,
    message: "Copied to Clipboard",
    autoClose: true,
    disallowClose: false,
  });
};

export { copy };

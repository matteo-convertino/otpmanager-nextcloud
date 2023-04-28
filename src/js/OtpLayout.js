import React from "react";

import { Box } from "@mantine/core";

export const OtpLayout = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 50px)",
        width: "100%",
        padding: 0,
        margin: 0,
      }}
    >
      {children}
    </Box>
  );
};

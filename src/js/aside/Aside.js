import React from "react";

import { Drawer, Text } from "@mantine/core";
import { AsideContent } from "./Content";

export default function Aside({ children, showAside, setShowAside, otp }) {
  return (
    <Drawer
      padding="md"
      position="right"
      size={380}
      opened={showAside}
      onClose={() => setShowAside(false)}
      title={
        <Text fw={700} fz="lg">
          Account Details
        </Text>
      }
      styles={{
        drawer: {
          top: "50px",
        },
      }}
    >
      <AsideContent otp={otp} />
      {children}
    </Drawer>
  );
}

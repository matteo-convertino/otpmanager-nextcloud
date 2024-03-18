import React from "react";

import { Drawer, Text, Divider } from "@mantine/core";
//import { AsideContent } from "./Content";

export default function Aside({ children, showAside, setShowAside, title, otp }) {
  return (
    <Drawer
      padding="md"
      position="right"
      size={380}
      opened={showAside}
      onClose={() => setShowAside(false)}
      title={
        <Text fw={700} fz="lg">
          {title}
        </Text>
      }
      styles={{
        drawer: {
          top: "50px",
        },
        body: {
          height: "calc(100% - 50px)",
          display: "flex",
          flexDirection: "column"
        }
      }}
    >
      {/*<AsideContent otp={otp} />*/}
      <Divider mb="lg" />
      
        {children}
    </Drawer>
  );
}

import {type ReactNode} from "react";

import {Divider, Drawer, Text} from "@mantine/core";

export default function Aside(
    {
        showAside,
        setShowAside,
        title,
        children,
    }: {
        showAside: boolean,
        setShowAside: (showAside: undefined) => void,
        title: string
        children: ReactNode,
    }
) {
    return (
        <Drawer
            padding="md"
            position="right"
            size={380}
            opened={showAside}
            onClose={() => setShowAside(undefined)}
            title={
                <Text fw={700} fz="lg">
                    {title}
                </Text>
            }
            styles={{
                body: {
                    height: "calc(100% - 71px)",
                    display: "flex",
                    flexDirection: "column",
                },
            }}
        >
            <Divider mb="lg"/>
            {children}
        </Drawer>
    );
}

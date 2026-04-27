import {ActionIcon, Group, Text, type TextProps} from "@mantine/core";
import {useHover} from "@mantine/hooks";
import {IconCopy} from "@tabler/icons-react";
import type {AccountResponseDatatable} from "@/dto/response/AccountResponseDatatable.ts";
import useAccountCode from "@/hooks/account/useAccountCode.ts";


export function AccountCode(
    {
        account,
        textProps,
        iconColor,
        hovered,
    }: {
        account: AccountResponseDatatable;
        textProps?: TextProps;
        iconColor?: string;
        hovered?: boolean;
    }
) {
    const {hovered: internalHovered, ref} = useHover();
    const {canCopyCode, shouldShowCode, getCodeLabel, copyCode} = useAccountCode();

    const resolvedHovered = hovered ?? internalHovered;
    const showCode = shouldShowCode(account) || resolvedHovered;

    return (
        <Group
            ref={hovered === undefined ? ref : undefined}
            spacing={"xs"}
            onClick={canCopyCode(account) ? (event) => {
                event.preventDefault();
                event.stopPropagation();
                copyCode(account);
            } : undefined}
        >
            <Text {...textProps}>
                {showCode ? getCodeLabel(account) : "*".repeat(account.digits)}
            </Text>

            {canCopyCode(account) && (
                <ActionIcon color={iconColor}>
                    <IconCopy size={18}/>
                </ActionIcon>
            )}
        </Group>
    );
}

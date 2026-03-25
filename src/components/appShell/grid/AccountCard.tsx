import type {AccountResponseDatatable} from "@/dto/response/AccountResponseDatatable.ts";
import {useHover} from "@mantine/hooks";
import {useSidebarStore} from "@/context/useSidebarStore.ts";
import {Box, Group, Paper, Text} from "@mantine/core";
import SpotlightCard from "@/components/utils/SpotlightCard.tsx";
import {AccountCode} from "@/components/appShell/shared/AccountCode.tsx";
import AccountActions from "@/components/appShell/shared/AccountActions.tsx";
import {IconShieldLock, IconTimeDuration30, IconTimeDuration45, IconTimeDuration60} from "@tabler/icons-react";
import {OtpType} from "@/utils/enum/otpType.ts";
import {OtpPeriod} from "@/utils/enum/otpPeriod.ts";
import {useModalsStore} from "@/context/useModalsStore.ts";
import useUpdateCounter from "@/hooks/useUpdateCounter.tsx";

export default function AccountCard({account}: { account: AccountResponseDatatable }) {
    const {hovered, ref} = useHover();
    const {setShowAsideInfo} = useSidebarStore();
    const {setShowSharedAccountToUnlock} = useModalsStore();
    const {onUpdate: onUpdateCounter} = useUpdateCounter();

    const issuerNotEmpty = account.issuer !== "";

    return (
        <Paper
            ref={ref}
            style={{cursor: "pointer"}}
            shadow={"sm"}
            withBorder
            h={150}
            onClick={() => {
                if (account.unlocked === false) {
                    setShowSharedAccountToUnlock(account);
                } else if (account.type === OtpType.HOTP && account.counter !== null && account.counter < 0) {
                    onUpdateCounter(account);
                } else {
                    setShowAsideInfo(account);
                }
            }}
        >
            <SpotlightCard p={"md"}>
                <Group align={"start"} spacing={"xl"} noWrap>
                    <Box>
                        {
                            account.type === OtpType.TOTP ?
                                account.period === OtpPeriod.P30
                                    ? <IconTimeDuration30 size={36}/>
                                    : account.period === OtpPeriod.P45
                                        ? <IconTimeDuration45 size={36}/>
                                        : <IconTimeDuration60 size={36}/>
                                : <IconShieldLock size={36}/>
                        }
                    </Box>

                    <Box style={{flexGrow: 1}}>
                        <Group align={"start"} spacing={"xl"} noWrap mb={"xl"} w={"100%"}>
                            <Box style={{flexGrow: 1}}>
                                <Text fz="lg">{issuerNotEmpty ? account.issuer : account.name}</Text>
                                <Text c="dimmed">{issuerNotEmpty ? account.name : ''}</Text>
                            </Box>
                            <AccountActions account={account} groupProps={{spacing: "xs"}}/>
                        </Group>

                        <AccountCode
                            account={account}
                            hovered={hovered}
                            textProps={{fz: "xl", c: "blue"}}
                        />
                    </Box>


                </Group>

            </SpotlightCard>

        </Paper>
    );
}

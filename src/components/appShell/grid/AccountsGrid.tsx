import {ScrollArea, SimpleGrid, Skeleton} from "@mantine/core";
import {useAccountsStore} from "@/context/useAccountsStore.ts";
import {AccountsEmpty} from "@/components/appShell/shared/AccountsEmpty.tsx";
import AccountCard from "@/components/appShell/grid/AccountCard.tsx";
import type {AccountResponseDatatable} from "@/dto/response/AccountResponseDatatable.ts";

export function AccountsGrid(
    {
        isTrash = false,
        accounts,
    }: {
        isTrash?: boolean,
        accounts?: AccountResponseDatatable[],
    }
) {
    const {isFetching} = useAccountsStore();
    const emptyMessage = isTrash ? "Trash is empty" : "Add your first OTP account";

    const skeletonData = [...Array(24)].map((_, __) => <Skeleton height={150} width={"100%"}/>);

    if (!isFetching && (accounts === undefined || accounts.length === 0)) return <AccountsEmpty message={emptyMessage}/>;

    return (
        <ScrollArea h={"100%"} offsetScrollbars scrollbarSize={4}>
            <SimpleGrid
                cols={4}
                breakpoints={[
                    {maxWidth: "xl", cols: 3},
                    {maxWidth: "lg", cols: 2},
                    // {maxWidth: "md", cols: 2},
                    {maxWidth: "sm", cols: 1},
                ]}
            >
                {
                    isFetching
                        ? skeletonData
                        : accounts?.map((account) =>
                            <AccountCard key={account.id} account={account} isTrash={isTrash}/>
                        )
                }
            </SimpleGrid>
        </ScrollArea>
    );
}

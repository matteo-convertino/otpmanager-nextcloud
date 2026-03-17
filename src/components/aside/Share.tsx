import {forwardRef, type Ref} from "react";
import {
    ActionIcon,
    Avatar, Box,
    Button,
    Card,
    Center, CloseButton,
    Divider,
    Group,
    Loader,
    MultiSelect, type MultiSelectValueProps,
    PasswordInput, rem,
    ScrollArea,
    Stack,
    Text, Tooltip,
} from "@mantine/core";
import {IconShareOff} from "@tabler/icons-react";
import {DatePickerInput} from "@mantine/dates";
import moment from "moment";
import useSharedAccountForm from "@/hooks/sharedAccount/useSharedAccountForm.tsx";
import type {ReceiverResponseDTO} from "@/dto/response/ReceiverResponseDTO.ts";

export default function AsideShare() {
    const {isFetchingActiveShares, activeShares, nextcloudUsers, form, onSubmit, onDelete} = useSharedAccountForm();

    return (
        <>
            <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
                <Stack spacing="lg">
                    <MultiSelect
                        itemComponent={Item}
                        valueComponent={Value}
                        data={nextcloudUsers.map((user) => ({
                            ...user,
                            group: user.isExternal ? "External users" : "Internal users",
                        }))}
                        filter={(searchValue, selected, item) => {
                            if (selected) return false;

                            return [item.label!, item.value].some((field) =>
                                field.toLowerCase().trim().includes(searchValue.toLowerCase().trim())
                            );
                        }}
                        label="Share account to an other user"
                        placeholder="Select users"
                        searchable
                        nothingFound="Nothing found"
                        clearable
                        maxDropdownHeight={300}
                        transitionProps={{
                            duration: 150,
                            transition: 'pop',
                            timingFunction: 'ease',
                        }}
                        limit={20}
                        required
                        {...form.getInputProps("users")}
                    />

                    <PasswordInput
                        label="Password"
                        placeholder="Insert your sharing password"
                        required
                        {...form.getInputProps("password")}
                    />

                    <DatePickerInput
                        placeholder="Select date"
                        label="Choose an expiration date, if you want to share forever leave blank"
                        transitionDuration={150}
                        transition="pop"
                        transitionTimingFunction="ease"
                        minDate={moment().add(1, "day").toDate()}
                        valueFormat={"YYYY-MM-DD"}
                        clearable
                        {...form.getInputProps("expirationDate")}
                        onChange={(date) => form.setValues({expirationDate: date})}
                    />

                    <Group position="right">
                        <Button type="submit">Submit</Button>
                    </Group>
                </Stack>
            </form>

            <Divider my="lg"/>

            {isFetchingActiveShares ? (
                <Center h="100%">
                    <Loader/>
                </Center>
            ) : activeShares.length > 0 ? (
                <>
                    <Text mb="lg">Active shares</Text>

                    <ScrollArea h="100%">
                        {activeShares.map((activeShare) => {
                            let receiver = activeShare.receiver;
                            const isValueOverflow = receiver.value!.length > 5;
                            const shortValue = isValueOverflow
                                ? `${receiver.value!.slice(0, 5)}...`
                                : receiver.value;

                            return (
                                <Card
                                    key={receiver.value}
                                    mb="md"
                                    shadow="md"
                                    radius="md"
                                    withBorder
                                >
                                    <Group position={"apart"} noWrap={true}>
                                        <Group noWrap={true}>
                                            <Avatar src={receiver.image} radius="xl"/>
                                            <Stack spacing="0">
                                                <Text fw={700} truncate>{receiver.label}</Text>

                                                <Group spacing={"5px"} noWrap={true}>
                                                    <Tooltip
                                                        label={receiver.value}
                                                        openDelay={300}
                                                        disabled={!isValueOverflow}
                                                    >
                                                        <Text fz="sm">
                                                            {shortValue}
                                                        </Text>
                                                    </Tooltip>
                                                    <Text fz="sm">|</Text>
                                                    <Text fz="sm" fs="italic">
                                                        {activeShare.expiredAt === null
                                                            ? "Never expires"
                                                            : `Expires on ${moment(
                                                                activeShare.expiredAt
                                                            ).format("D/MM/YYYY")}`}
                                                    </Text>
                                                </Group>

                                            </Stack>
                                        </Group>

                                        <ActionIcon
                                            color="red"
                                            onClick={() => onDelete(activeShare.id, receiver)}
                                        >
                                            <IconShareOff size={18}/>
                                        </ActionIcon>
                                    </Group>
                                </Card>
                            );
                        })}
                    </ScrollArea>
                </>
            ) : (
                <></>
            )}
        </>
    );
}

const Item = forwardRef(
    ({
         id, label, value, image, isExternal, ...others
     }: ReceiverResponseDTO, ref: Ref<HTMLDivElement> | undefined) =>
        <div ref={ref} {...others}>
            <Group noWrap>
                <Avatar src={image} radius="xl"/>

                <div>
                    <Text>{label}</Text>
                    <Text size="xs" color="dimmed">
                        {value}
                    </Text>
                </div>
            </Group>
        </div>
);


function Value(
    {
        id,
        label,
        value,
        image,
        isExternal,
        onRemove,
        classNames,
        ...others
    }: MultiSelectValueProps & ReceiverResponseDTO) {
    return (
        <div {...others}>
            <Box
                sx={(theme) => ({
                    display: 'flex',
                    cursor: 'default',
                    alignItems: 'center',
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
                    border: `${rem(1)} solid ${
                        theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[4]
                    }`,
                    paddingLeft: "4px",
                    paddingBottom: "4px",
                    paddingTop: "4px",
                    borderRadius: theme.radius.md,
                })}
            >
                <Avatar size="sm" src={image} radius="xl" mr={"sm"}/>
                <Box sx={{lineHeight: 1, fontSize: rem(12)}}>{label}</Box>
                <CloseButton
                    onMouseDown={onRemove}
                    variant="transparent"
                    size={22}
                    iconSize={14}
                    tabIndex={-1}
                />
            </Box>
        </div>
    );
}

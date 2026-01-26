import {forwardRef, type Ref} from "react";
import {
    ActionIcon,
    Avatar,
    Button,
    Card,
    Center,
    Divider,
    Group,
    Loader,
    MultiSelect,
    PasswordInput,
    ScrollArea,
    Stack,
    Text,
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
                        itemComponent={SelectItem}
                        data={nextcloudUsers}
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
                                                <Text fw={700}>{receiver.label}</Text>
                                                <>
                                                    <Group spacing={"5px"} noWrap={true}>
                                                        <Text fz="sm">{receiver.value}</Text>
                                                        <Text fz="sm">|</Text>
                                                        <Text fz="sm" fs="italic">
                                                            {activeShare.expiredAt === null
                                                                ? "Never expires"
                                                                : `Expires on ${moment(
                                                                    activeShare.expiredAt
                                                                ).format("D/MM/YYYY")}`}
                                                        </Text>
                                                    </Group>
                                                </>
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

const SelectItem = forwardRef(
    ({
         id, label, value, image, ...others
     }: ReceiverResponseDTO, ref: Ref<HTMLDivElement> | undefined) =>
        <div ref={ref} {...others}>
            <Group noWrap>
                <Avatar src={image} radius="xl"/>

                <div>
                    <Text>{label == null ? value : label}</Text>
                    <Text size="xs" color="dimmed">
                        {value}
                    </Text>
                </div>
            </Group>
        </div>
);

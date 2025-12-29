import useOtpManagerApi from "@/hooks/useOtpManagerApi.ts";
import {useForm, zodResolver} from "@mantine/form";
import SharedAccountService from "@/services/SharedAccountService.ts";
import {
    sharedAccountCreateRequestSchema,
    type SharedAccountCreateRequestSchemaForm
} from "@/dto/request/SharedAccountCreateRequestDTO.ts";
import {IconCopy} from "@tabler/icons-react";
import {AES, Hex, SHA256, WordArray} from "crypto-es";
import {copy} from "@/utils/copy.tsx";
import {ActionIcon, Text} from "@mantine/core";
import {useEffect, useState} from "react";
import type {NextcloudUserDTO} from "@/dto/response/NextcloudUserDTO.ts";
import type {SharedAccountDetailedResponseDTO} from "@/dto/response/SharedAccountDetailedResponseDTO.ts";
import {useSidebarStore} from "@/context/useSidebarStore.ts";
import moment from "moment";

export default function useSharedAccountForm() {
    const otpManagerApi = useOtpManagerApi();
    const {showAsideShare: otp} = useSidebarStore();

    const [activeShares, setActiveShares] = useState<SharedAccountDetailedResponseDTO[]>([]);
    const [nextcloudUsers, setNextcloudUsers] = useState<NextcloudUserDTO[]>([]);

    const [isFetchingNextcloudUsers, setIsFetchingNextcloudUsers] = useState(true);
    const [isFetchingActiveShares, setIsFetchingActiveShares] = useState(true);

    const form = useForm<SharedAccountCreateRequestSchemaForm>({
        initialValues: {
            users: [],
            expirationDate: null,
            password: "",
        },
        validate: zodResolver(sharedAccountCreateRequestSchema),
    });

    useEffect(() => {
        if (otp === undefined) return;

        if (isFetchingNextcloudUsers) {
            otpManagerApi({
                api: () => SharedAccountService.getInstance().getUsersByAccountId(otp.id),
                showNotifications: false,
                onComplete: (nextcloudUsers) => {
                    setNextcloudUsers(nextcloudUsers);
                    setIsFetchingNextcloudUsers(false);
                }
            });
        }

        if (isFetchingActiveShares) {
            otpManagerApi({
                api: () => SharedAccountService.getInstance().getAllByAccountId(otp.id),
                showNotifications: false,
                onComplete: (activeShares) => {
                    setActiveShares(activeShares);
                    setIsFetchingActiveShares(false);
                }
            });
        }
    }, [isFetchingNextcloudUsers, isFetchingActiveShares]);

    function onSubmit(values: SharedAccountCreateRequestSchemaForm) {
        if (otp === undefined) return;

        const password = SHA256(values.password).toString();
        const key = Hex.parse(password);
        const iv = WordArray.random(16);
        const sharedSecret = AES.encrypt(otp.decryptedSecret!, key, {iv: iv}).toString();

        otpManagerApi({
            api: () => SharedAccountService.getInstance().create({
                users: values.users,
                password: password,
                expirationDate: values.expirationDate === null ? undefined : moment(values.expirationDate).format("MM/DD/YYYY"),
                accountSecret: otp.secret,
                iv: Hex.stringify(iv),
                sharedSecret: sharedSecret,
            }),
            titleOnLoading: "Sharing account",
            messageOnLoading: "Account is being sharing",
            titleOnSuccess: "Account shared",
            messageOnSuccess: (
                <>
                    <Text>
                        {otp.issuer != "" ? otp.issuer + " (" + otp.name + ")" : otp.name}{" "}
                        shared with success.
                    </Text>
                    <Text fw={600}>
                        Remember to share the password you used with the users you shared
                        your account with.
                    </Text>
                    <Text td="underline" onClick={() => copy(values.password)}>
                        Click here to copy the password.
                    </Text>
                </>
            ),
            iconOnSuccess: (
                <ActionIcon color="blue" size="lg" radius="xl" variant="filled">
                    <IconCopy
                        size={26}
                        onClick={() => copy(values.password)}
                    />
                </ActionIcon>
            ),
            onComplete: () => {
                form.reset();
                // setAccounts(undefined);
                // setIsFetching(true);
                setActiveShares([]);
                setIsFetchingActiveShares(true);
            }
        });
    }

    function onDelete(accountId: number, receiver: any) {
        if (otp === undefined) return;

        otpManagerApi({
            api: () => SharedAccountService.getInstance().delete(accountId, receiver.value),
            titleOnLoading: "Shared account",
            messageOnLoading: "Sharing is being deleting",
            titleOnSuccess: "Shared account deleted",
            messageOnSuccess:
                (otp.issuer != "" ? otp.issuer + " (" + otp.name + ")" : otp.name) +
                " is no longer shared with " +
                receiver.label,
            onComplete: () => {
                setActiveShares([]);
                setIsFetchingActiveShares(true);
                setIsFetchingNextcloudUsers(true);
            }
        })
    }


    return {form, onSubmit, onDelete, activeShares, nextcloudUsers, isFetchingActiveShares, isFetchingNextcloudUsers};
}


import {Modal} from "@mantine/core";
import {IconEdit} from "@tabler/icons-react";
import ModalContent from "./CreateEditContent";
import {useModalsStore} from "@/context/useModalsStore.ts";
import useEditOtpAccountForm from "@/hooks/account/useEditOtpAccountForm.tsx";

export function EditOtpAccount() {
    const {showEditOtpAccount: otp, setShowEditOtpAccount} = useModalsStore();
    const {form, onSubmit} = useEditOtpAccountForm();

    return (
        <Modal
            opened={otp !== undefined}
            onClose={() => setShowEditOtpAccount(undefined)}
            title="Edit Account"
        >
            <form
                onSubmit={form.onSubmit((values) => onSubmit(values))}
            >
                <ModalContent
                    form={form}
                    textSubmitButton="Save"
                    iconSubmitButton={<IconEdit size="18px"/>}
                    isSecretKeyDisabled={true}
                    isSharedAccount={otp !== undefined && otp.unlocked !== null}
                />
            </form>
        </Modal>
    );
}

import {Modal} from "@mantine/core";
import {IconPlus} from "@tabler/icons-react";
import ModalContent from "./CreateEditContent";
import {useModalsStore} from "@/context/useModalsStore.ts";
import useCreateOtpAccountForm from "@/hooks/account/useCreateOtpAccountForm.tsx";

export function CreateOtpAccount() {
    const {showCreateAccount, setShowCreateAccount} = useModalsStore();
    const {form, onSubmit} = useCreateOtpAccountForm();

    return (
        <Modal
            opened={showCreateAccount}
            onClose={() => {
                setShowCreateAccount(false);
            }}
            title="Add New Account"
        >
            <form
                onSubmit={form.onSubmit((values) => onSubmit(values))}
            >
                <ModalContent
                    form={form}
                    textSubmitButton="Create"
                    iconSubmitButton={<IconPlus size="18px"/>}
                    isSecretKeyDisabled={false}
                    isSharedAccount={false}
                />
            </form>
        </Modal>
    );
}

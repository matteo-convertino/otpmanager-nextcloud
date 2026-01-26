import PasswordSaveForm from "@/components/password/PasswordSaveForm.tsx";
import usePasswordUpdateForm from "@/hooks/password/usePasswordUpdateForm.tsx";


export default function PasswordUpdateForm() {
    const {form, onSubmit} = usePasswordUpdateForm();

    return (
        <PasswordSaveForm
            form={form}
            onSubmit={form.onSubmit((values) => onSubmit(values))}
            isUpdate={true}
        />
    );
}

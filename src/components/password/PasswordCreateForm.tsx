import PasswordSaveForm from "@/components/password/PasswordSaveForm.tsx";
import usePasswordCreateForm from "@/hooks/password/usePasswordCreateForm.tsx";


export default function PasswordCreateForm() {
    const {form, onSubmit} = usePasswordCreateForm();

    return (
        <PasswordSaveForm
            form={form}
            onSubmit={form.onSubmit((values) => onSubmit(values))}
            isUpdate={false}
        />
    );
}

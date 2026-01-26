export type passwordUpdateFormType = {
    oldPassword: string
    password: string
    confirmPassword: string
};

export type PasswordUpdateRequestDTO = {
    oldPassword: string
    newPassword: string
}

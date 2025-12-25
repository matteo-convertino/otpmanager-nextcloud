export type SharedAccountResponseDetailedDTO = {
    id: number
    secret: string
    name: string
    issuer: string
    icon: string
    position: number
    account_id: number
    receiver: {
        image: string
        value: string
        label: string
    }
    unlocked: boolean
    created_at: Date
    updated_at: Date
    expired_at: Date
}

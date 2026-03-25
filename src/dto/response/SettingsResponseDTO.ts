import type {OtpViewMode} from "@/utils/enum/otpViewMode.ts";

export type SettingsResponseDTO = {
    id: number
    showCodes: boolean
    darkMode: boolean
    recordsPerPage: string
    viewMode: OtpViewMode
    userId: string
}



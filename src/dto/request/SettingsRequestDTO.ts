import type {OtpViewMode} from "@/utils/enum/otpViewMode.ts";

export type SettingsRequestDTO = {
    showCodes?: boolean
    darkMode?: boolean
    recordsPerPage?: string
    viewMode?: OtpViewMode
}



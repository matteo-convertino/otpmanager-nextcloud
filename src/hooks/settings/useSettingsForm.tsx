import useOtpManagerApi from "@/hooks/useOtpManagerApi.ts";
import {useSettingsStore} from "@/context/useSettingsStore.ts";
import SettingsService from "@/services/SettingsService.ts";
import type {SettingsRequestDTO} from "@/dto/request/SettingsRequestDTO.ts";
import type {SettingsResponseDTO} from "@/dto/response/SettingsResponseDTO.ts";

export default function useSettingsForm() {
    const otpManagerApi = useOtpManagerApi();
    const {setShowCodes, setDarkMode, setRecordsPerPage, setViewMode} = useSettingsStore();

    function onUpdate(settingsRequestDTO: SettingsRequestDTO) {
        if (settingsRequestDTO.showCodes !== undefined) setShowCodes(settingsRequestDTO.showCodes);
        if (settingsRequestDTO.darkMode !== undefined) setDarkMode(settingsRequestDTO.darkMode);
        if (settingsRequestDTO.recordsPerPage !== undefined) setRecordsPerPage(parseInt(settingsRequestDTO.recordsPerPage));
        if (settingsRequestDTO.viewMode !== undefined) setViewMode(settingsRequestDTO.viewMode);

        otpManagerApi({
            api: () => SettingsService.getInstance().save(settingsRequestDTO),
            showNotifications: false,
            onComplete: (settingsResponseDTO) => updateStore(settingsResponseDTO),
        });
    }

    function updateStore(settingsResponseDTO: SettingsResponseDTO) {
        setShowCodes(settingsResponseDTO.showCodes);
        setDarkMode(settingsResponseDTO.darkMode);
        setRecordsPerPage(settingsResponseDTO.recordsPerPage === "All" ? -1 : parseInt(settingsResponseDTO.recordsPerPage));
        setViewMode(settingsResponseDTO.viewMode);
    }

    return {onUpdate};
}

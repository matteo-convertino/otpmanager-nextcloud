import {useEffect} from "react";
import {useSettingsStore} from "@/context/useSettingsStore.ts";
import useOtpManagerApi from "@/hooks/useOtpManagerApi.ts";
import SettingsService from "@/services/SettingsService.ts";
import type {SettingsResponseDTO} from "@/dto/response/SettingsResponseDTO.ts";

export default function useLoadSettings() {
    const otpManagerApi = useOtpManagerApi();
    const {setShowCodes, setDarkMode, setRecordsPerPage, setViewMode, setIsFetching} = useSettingsStore();

    useEffect(() => {
        setIsFetching(true);

        otpManagerApi({
            api: SettingsService.getInstance().get,
            showNotifications: false,
            onComplete: (settingsResponseDTO) => {
                updateStore(settingsResponseDTO);
                setIsFetching(false);
            }
        });
    }, []);

    function updateStore(settingsResponseDTO: SettingsResponseDTO) {
        setShowCodes(settingsResponseDTO.showCodes);
        setDarkMode(settingsResponseDTO.darkMode);
        setRecordsPerPage(settingsResponseDTO.recordsPerPage === "All" ? -1 : parseInt(settingsResponseDTO.recordsPerPage));
        setViewMode(settingsResponseDTO.viewMode);
    }
}

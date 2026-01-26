import useOtpManagerApi from "@/hooks/useOtpManagerApi.ts";
import {useSettingsStore} from "@/context/useSettingsStore.ts";
import SettingsService from "@/services/SettingsService.ts";
import type {SettingsRequestDTO} from "@/dto/request/SettingsRequestDTO.ts";
import {useEffect, useState} from "react";

export default function useSettingsForm() {
    const otpManagerApi = useOtpManagerApi();
    const {setShowCodes, setDarkMode, setRecordsPerPage} = useSettingsStore();
    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        setIsFetching(true);

        otpManagerApi({
            api: SettingsService.getInstance().get,
            showNotifications: false,
            onComplete: (settingsResponseDTO) => {
                setShowCodes(settingsResponseDTO.showCodes);
                setDarkMode(settingsResponseDTO.darkMode);
                setRecordsPerPage(parseInt(settingsResponseDTO.recordsPerPage));
                setIsFetching(false);
            }
        });
    }, []);

    function onUpdate(settingsRequestDTO: SettingsRequestDTO) {
        if(settingsRequestDTO.showCodes !== undefined) setShowCodes(settingsRequestDTO.showCodes);
        if(settingsRequestDTO.darkMode !== undefined) setDarkMode(settingsRequestDTO.darkMode);
        if(settingsRequestDTO.recordsPerPage !== undefined) setRecordsPerPage(parseInt(settingsRequestDTO.recordsPerPage));

        otpManagerApi({
            api: () => SettingsService.getInstance().save(settingsRequestDTO),
            showNotifications: false,
            onComplete: (settingsResponseDTO) => {
                setShowCodes(settingsResponseDTO.showCodes);
                setDarkMode(settingsResponseDTO.darkMode);
                setRecordsPerPage(parseInt(settingsResponseDTO.recordsPerPage));
            }
        });
    }

    return {isFetching, onUpdate};
}


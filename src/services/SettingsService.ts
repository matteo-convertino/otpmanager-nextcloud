import otpManagerAxiosClient from "@/utils/otpManagerAxiosClient";
import type {SettingsResponseDTO} from "@/dto/response/SettingsResponseDTO.ts";
import {SettingsRoutes} from "@/services/routes/settingsRoutes.ts";
import type {SettingsRequestDTO} from "@/dto/request/SettingsRequestDTO.ts";


export default class SettingsService {
    private static instance: SettingsService;

    private constructor() {
    }

    public static getInstance(): SettingsService {
        if (!SettingsService.instance) {
            SettingsService.instance = new SettingsService();
        }

        return SettingsService.instance;
    }

    public async get(): Promise<SettingsResponseDTO> {
        return otpManagerAxiosClient.get<SettingsResponseDTO>(
            SettingsRoutes.GET
        ).then(res => res.data);
    }

    public async save(settingsRequestDTO: SettingsRequestDTO): Promise<SettingsResponseDTO> {
        return otpManagerAxiosClient.post<SettingsResponseDTO>(
            SettingsRoutes.SAVE,
            settingsRequestDTO
        ).then(res => res.data);
    }
}

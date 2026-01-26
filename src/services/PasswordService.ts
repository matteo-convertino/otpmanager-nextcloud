import otpManagerAxiosClient from "@/services/utils/otpManagerAxiosClient.ts";
import {PasswordRoutes} from "@/services/routes/passwordRoutes.ts";
import type {PasswordRequestDTO} from "@/dto/request/PasswordRequestDTO.ts";
import type {PasswordResponseDTO} from "@/dto/response/PasswordResponseDTO.ts";
import type {PasswordResponseStatusDTO} from "@/dto/response/PasswordResponseStatusDTO.ts";
import type {PasswordUpdateRequestDTO} from "@/dto/request/PasswordUpdateRequestDTO.ts";

export default class PasswordService {
    private static instance: PasswordService;

    private constructor() {
    }

    public static getInstance(): PasswordService {
        if (!PasswordService.instance) {
            PasswordService.instance = new PasswordService();
        }

        return PasswordService.instance;
    }

    public async create(passwordRequestDTO: PasswordRequestDTO): Promise<PasswordResponseDTO> {
        return otpManagerAxiosClient.post<PasswordResponseDTO>(
            PasswordRoutes.CREATE,
            passwordRequestDTO
        ).then(res => res.data);
    }

    public async status(): Promise<PasswordResponseStatusDTO> {
        return otpManagerAxiosClient.get<PasswordResponseStatusDTO>(
            PasswordRoutes.STATUS
        ).then(res => res.data);
    }

    public async check(passwordRequestDTO: PasswordRequestDTO): Promise<PasswordResponseDTO> {
        return otpManagerAxiosClient.post<PasswordResponseDTO>(
            PasswordRoutes.CHECK,
            passwordRequestDTO
        ).then(res => res.data);
    }

    public async update(passwordUpdateRequestDTO: PasswordUpdateRequestDTO): Promise<PasswordResponseDTO> {
        return otpManagerAxiosClient.put<PasswordResponseDTO>(
            PasswordRoutes.UPDATE,
            passwordUpdateRequestDTO
        ).then(res => res.data);
    }
}

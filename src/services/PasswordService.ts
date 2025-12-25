import otpManagerAxiosClient from "@/utils/otpManagerAxiosClient";
import {AccountRoutes} from "@/services/routes/accountRoutes.ts";
import {PasswordRoutes} from "@/services/routes/passwordRoutes.ts";
import type {PasswordRequestDTO} from "@/dto/request/PasswordRequestDTO.ts";
import type {PasswordResponseDTO} from "@/dto/response/PasswordResponseDTO.ts";
import type {passwordUpdateFormType} from "@/dto/utils/passwordFormUpdateType.ts";

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

    public async get(): Promise<boolean> {
        return otpManagerAxiosClient.get<boolean>(
            PasswordRoutes.GET
        ).then(res => res.data);
    }

    public async check(passwordRequestDTO: PasswordRequestDTO): Promise<PasswordResponseDTO> {
        return otpManagerAxiosClient.post<PasswordResponseDTO>(
            PasswordRoutes.CHECK,
            passwordRequestDTO
        ).then(res => res.data);
    }

    public async update(passwordUpdateRequestDTO: passwordUpdateFormType): Promise<PasswordResponseDTO> {
        return otpManagerAxiosClient.put<PasswordResponseDTO>(
            AccountRoutes.UPDATE,
            passwordUpdateRequestDTO
        ).then(res => res.data);
    }
}

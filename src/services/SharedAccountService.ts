import otpManagerAxiosClient from "@/utils/otpManagerAxiosClient";
import type {AccountResponseDTO} from "@/dto/response/AccountResponseDTO.ts";
import {SharedAccountRoutes} from "@/services/routes/sharedAccountRoutes.ts";
import type {SharedAccountDetailedResponseDTO} from "@/dto/response/SharedAccountDetailedResponseDTO.ts";
import type {SharedAccountResponseDTO} from "@/dto/response/SharedAccountResponseDTO.ts";
import type {SharedAccountUnlockDTO} from "@/dto/request/SharedAccountUnlockDTO.ts";
import type {SharedAccountCreateRequestDTO} from "@/dto/request/SharedAccountCreateRequestDTO.ts";
import type {SharedAccountEditRequestDTO} from "@/dto/request/SharedAccountEditRequestDTO.ts";
import type {NextcloudUserDTO} from "@/dto/response/NextcloudUserDTO.ts";


export default class SharedAccountService {
    private static instance: SharedAccountService;

    private constructor() {
    }

    public static getInstance(): SharedAccountService {
        if (!SharedAccountService.instance) {
            SharedAccountService.instance = new SharedAccountService();
        }

        return SharedAccountService.instance;
    }

    public async getAllByAccountId(accountId: number): Promise<SharedAccountDetailedResponseDTO[]> {
        return otpManagerAxiosClient.get<SharedAccountDetailedResponseDTO[]>(
            SharedAccountRoutes.GET_ALL_BY_ACCOUNT_ID(accountId)
        ).then(res => res.data);
    }

    public async getUsersByAccountId(accountId: number): Promise<NextcloudUserDTO[]> {
        return otpManagerAxiosClient.get<NextcloudUserDTO[]>(
            SharedAccountRoutes.GET_USERS_BY_ACCOUNT_ID(accountId)
        ).then(res => res.data);
    }

    public async create(sharedAccountCreateRequestDTO: SharedAccountCreateRequestDTO): Promise<SharedAccountResponseDTO> {
        return otpManagerAxiosClient.post<SharedAccountResponseDTO>(
            SharedAccountRoutes.CREATE,
            sharedAccountCreateRequestDTO
        ).then(res => res.data);
    }

    public async update(sharedAccountEditRequestDTO: SharedAccountEditRequestDTO): Promise<SharedAccountResponseDTO> {
        return otpManagerAxiosClient.put<SharedAccountResponseDTO>(
            SharedAccountRoutes.UPDATE,
            sharedAccountEditRequestDTO
        ).then(res => res.data);
    }

    public async delete(accountId: number, receiverId?: number): Promise<SharedAccountResponseDTO> {
        return otpManagerAxiosClient.delete<SharedAccountResponseDTO>(
            SharedAccountRoutes.DELETE(accountId, receiverId),
        ).then(res => res.data);
    }

    public async unlock(sharedAccountUnlockDTO: SharedAccountUnlockDTO): Promise<AccountResponseDTO> {
        return otpManagerAxiosClient.post<AccountResponseDTO>(
            SharedAccountRoutes.UNLOCK,
            sharedAccountUnlockDTO
        ).then(res => res.data);
    }

    ////////////////////////////////

    // public async getAll(): Promise<AccountResponseDTO[]> {
    //     return otpManagerAxiosClient.get<AccountResponseDTO[]>(
    //         AccountRoutes.GET_ALL
    //     ).then(res => res.data);
    // }
    //
    // public async import(data: unknown): Promise<void> {
    //     return otpManagerAxiosClient.post<void>(
    //         AccountRoutes.IMPORT,
    //         data
    //     ).then(res => res.data);
    // }
}

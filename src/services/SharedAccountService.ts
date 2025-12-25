import otpManagerAxiosClient from "@/utils/otpManagerAxiosClient";
import type {AccountResponseDTO} from "@/dto/response/AccountResponseDTO.ts";
import type {AccountRequestDTO} from "@/dto/request/AccountRequestDTO.ts";
import {SharedAccountRoutes} from "@/services/routes/sharedAccountRoutes.ts";
import type {SharedAccountResponseDetailedDTO} from "@/dto/response/SharedAccountResponseDetailedDTO.ts";
import type {SharedAccountResponseDTO} from "@/dto/response/SharedAccountResponseDTO.ts";
import type {SharedAccountUnlockDTO} from "@/dto/request/SharedAccountUnlockDTO.ts";


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

    public async getByAccountId(accountId: number): Promise<SharedAccountResponseDetailedDTO> {
        return otpManagerAxiosClient.get<SharedAccountResponseDetailedDTO>(
            SharedAccountRoutes.GET_BY_ACCOUNT_ID(accountId)
        ).then(res => res.data);
    }

    public async update(accountRequestDTO: AccountRequestDTO): Promise<AccountResponseDTO> {
        return otpManagerAxiosClient.put<AccountResponseDTO>(
            SharedAccountRoutes.UPDATE,
            accountRequestDTO
        ).then(res => res.data);
    }

    public async delete(id: number): Promise<SharedAccountResponseDTO> {
        return otpManagerAxiosClient.delete<SharedAccountResponseDTO>(
            SharedAccountRoutes.DELETE(id),
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

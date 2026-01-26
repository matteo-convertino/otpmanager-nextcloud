import otpManagerAxiosClient from "@/services/utils/otpManagerAxiosClient.ts";
import type {AccountResponseDTO} from "@/dto/response/AccountResponseDTO.ts";
import {SharedAccountRoutes} from "@/services/routes/sharedAccountRoutes.ts";
import type {SharedAccountResponseDTO} from "@/dto/response/SharedAccountResponseDTO.ts";
import type {SharedAccountUnlockDTO} from "@/dto/request/SharedAccountUnlockDTO.ts";
import type {SharedAccountCreateRequestDTO} from "@/dto/request/SharedAccountCreateRequestDTO.ts";
import type {SharedAccountEditRequestDTO} from "@/dto/request/SharedAccountEditRequestDTO.ts";
import type {UpdateCounterRequestDTO} from "@/dto/request/UpdateCounterRequestDTO.ts";
import type {ReceiverResponseDTO} from "@/dto/response/ReceiverResponseDTO.ts";


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

    public async getAllByAccountId(accountId: number): Promise<SharedAccountResponseDTO[]> {
        return otpManagerAxiosClient.get<SharedAccountResponseDTO[]>(
            SharedAccountRoutes.GET_ALL_BY_ACCOUNT_ID(accountId)
        ).then(res => res.data);
    }

    public async getUsersByAccountId(accountId: number): Promise<ReceiverResponseDTO[]> {
        return otpManagerAxiosClient.get<ReceiverResponseDTO[]>(
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

    public async delete(accountId: number, receiverId: string | null): Promise<SharedAccountResponseDTO> {
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

    public async updateCounter(updateCounterRequestDTO: UpdateCounterRequestDTO): Promise<SharedAccountResponseDTO> {
        return otpManagerAxiosClient.post<SharedAccountResponseDTO>(
            SharedAccountRoutes.UPDATE_COUNTER,
            updateCounterRequestDTO
        ).then(res => res.data);
    }
}

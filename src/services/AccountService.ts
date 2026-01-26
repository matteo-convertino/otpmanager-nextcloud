import otpManagerAxiosClient from "@/services/utils/otpManagerAxiosClient.ts";
import {AccountRoutes} from "@/services/routes/accountRoutes.ts";
import type {AccountResponseDTO} from "@/dto/response/AccountResponseDTO.ts";
import type {AccountRequestDTO} from "@/dto/request/AccountRequestDTO.ts";
import type {ImportAccountsDTO} from "@/dto/request/ImportAccountsDTO.ts";
import type {UpdateCounterRequestDTO} from "@/dto/request/UpdateCounterRequestDTO.ts";
import type {AccountResponseDatatable} from "@/dto/response/AccountResponseDatatable.ts";


export default class AccountService {
    private static instance: AccountService;

    private constructor() {
    }

    public static getInstance(): AccountService {
        if (!AccountService.instance) {
            AccountService.instance = new AccountService();
        }

        return AccountService.instance;
    }

    public async create(accountRequestDTO: AccountRequestDTO): Promise<AccountResponseDTO> {
        return otpManagerAxiosClient.post<AccountResponseDTO>(
            AccountRoutes.CREATE,
            accountRequestDTO
        ).then(res => res.data);
    }

    public async getAll(): Promise<AccountResponseDatatable[]> {
        return otpManagerAxiosClient.get<AccountResponseDatatable[]>(
            AccountRoutes.GET_ALL
        ).then(res => res.data);
    }

    public async getById(id: number): Promise<AccountResponseDTO> {
        return otpManagerAxiosClient.get<AccountResponseDTO>(
            AccountRoutes.GET_BY_ID(id)
        ).then(res => res.data);
    }

    public async update(accountRequestDTO: AccountRequestDTO): Promise<AccountResponseDTO> {
        return otpManagerAxiosClient.put<AccountResponseDTO>(
            AccountRoutes.UPDATE,
            accountRequestDTO
        ).then(res => res.data);
    }

    public async delete(id: number): Promise<AccountResponseDTO> {
        return otpManagerAxiosClient.delete<AccountResponseDTO>(
            AccountRoutes.DELETE(id),
        ).then(res => res.data);
    }

    public async import(importAccountsDTO: ImportAccountsDTO): Promise<void> {
        return otpManagerAxiosClient.post<void>(
            AccountRoutes.IMPORT,
            importAccountsDTO
        ).then(res => res.data);
    }

    public async updateCounter(updateCounterRequestDTO: UpdateCounterRequestDTO): Promise<AccountResponseDTO> {
        return otpManagerAxiosClient.post<AccountResponseDTO>(
            AccountRoutes.UPDATE_COUNTER,
            updateCounterRequestDTO
        ).then(res => res.data);
    }
}

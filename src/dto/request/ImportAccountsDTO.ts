import {type AccountRequestDTO} from "@/dto/request/AccountRequestDTO.ts";

export type ImportAccountsDTO = {
    accounts: AccountRequestDTO[];
    currentPassword?: string;
    iv?: string
    passwordUsedOnExport?: string
}

<?php

declare(strict_types=1);

namespace OCA\OtpManager\Service;

use OCA\OtpManager\Db\Account;
use OCA\OtpManager\Db\AccountMapper;
use OCA\OtpManager\Db\SharedAccountMapper;
use OCA\OtpManager\Dto\Request\Account\AccountCreateRequestDto;
use OCA\OtpManager\Dto\Request\Account\AccountDeleteRequestDto;
use OCA\OtpManager\Dto\Request\Account\AccountGetRequestDto;
use OCA\OtpManager\Dto\Request\Account\AccountImportRequestDto;
use OCA\OtpManager\Dto\Request\Account\AccountUpdateCounterRequestDto;
use OCA\OtpManager\Dto\Request\Account\AccountUpdateRequestDto;
use OCA\OtpManager\Dto\Response\AccountDatatableResponseDto;
use OCA\OtpManager\Dto\Response\AccountResponseDto;
use OCA\OtpManager\Utils\OtpAlgorithm;
use OCA\OtpManager\Utils\OtpType;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\OCS\OCSBadRequestException;
use OCP\AppFramework\OCS\OCSException;
use Psr\Log\LoggerInterface;

class AccountService
{

    public function __construct(
        private readonly AccountMapper       $accountMapper,
        private readonly SharedAccountMapper $sharedAccountMapper,
        private readonly EncryptionService   $encryption,
        private readonly LoggerInterface $logger,
        private readonly ?string             $userId = null
    )
    {
    }

    /**
     * @param AccountGetRequestDto $accountGetRequestDto
     * @return DataResponse<AccountResponseDto | null>
     */
    public function get(AccountGetRequestDto $accountGetRequestDto): DataResponse
    {
        $account = $this->accountMapper->find(
            column: "id",
            value: $accountGetRequestDto->id,
            userId: $this->userId
        );
        if ($account === null) return new DataResponse(null);

        return new DataResponse(AccountResponseDto::accountToDto($account));
    }

    /**
     * @return DataResponse<AccountDatatableResponseDto[]>
     * @throws OCSException
     */
    public function getAll(): DataResponse
    {
        $accounts = $this->accountMapper->findAllByUser($this->userId);
        $sharedAccounts = $this->sharedAccountMapper->findAllByReceiverJoin($this->userId);

        return new DataResponse([
            ...array_map(
                static fn(Account $a) => AccountDatatableResponseDto::accountToDto($a),
                $accounts
            ),
            ...array_map(
                static fn(mixed $a) => AccountDatatableResponseDto::sharedAccountToDto($a),
                $sharedAccounts
            ),
        ]);
    }

    /**
     * @param AccountCreateRequestDto $accountCreateRequestDto
     * @return DataResponse<AccountResponseDto>
     * @throws OCSBadRequestException | OCSException
     */
    public function create(AccountCreateRequestDto $accountCreateRequestDto): DataResponse
    {
        $account = $this->accountMapper->find(
            column: "secret",
            value: $accountCreateRequestDto->secret,
            userId: $this->userId
        );

        if ($account !== null && $account->getDeletedAt() === null) {
            throw new OCSBadRequestException("This secret key already exist");
        }

        $maxSharedAccountPos = $this->sharedAccountMapper->findMaxPosition($this->userId);
        $maxAccountPos = $this->accountMapper->findMaxPosition($this->userId);

        $position = max($maxSharedAccountPos, $maxAccountPos) + 1;
        $algorithm = OtpAlgorithm::convertToInt($accountCreateRequestDto->algorithm);

        if ($account === null) {
            $account = new Account();

            $account->setSecret($accountCreateRequestDto->secret);
            $account->setName($accountCreateRequestDto->name);
            $account->setIssuer($accountCreateRequestDto->issuer);
            $account->setDigits($accountCreateRequestDto->digits);
            $account->setType($accountCreateRequestDto->type);
            $account->setPeriod($accountCreateRequestDto->period);
            $account->setAlgorithm($algorithm);
            $account->setCounter($accountCreateRequestDto->type == OtpType::TOTP->value ? null : -1);
            $account->setPosition($position);
            $account->setIcon("default");
            $account->setUserId($this->userId);
            $account->setCreatedAt(date("Y-m-d H:i:s"));
            $account->setUpdatedAt(date("Y-m-d H:i:s"));

            $account = $this->accountMapper->insert($account);
        } else {
            $account->setName($accountCreateRequestDto->name);
            $account->setIssuer($accountCreateRequestDto->issuer);
            $account->setDigits($accountCreateRequestDto->digits);
            $account->setType($accountCreateRequestDto->type);
            $account->setPeriod($accountCreateRequestDto->period);
            $account->setAlgorithm($algorithm);
            $account->setCounter($accountCreateRequestDto->counter);
            $account->setPosition($position);
            $account->setDeletedAt(null);
            $account->setUpdatedAt(date("Y-m-d H:i:s"));

            $account = $this->accountMapper->update($account);
        }

        return new DataResponse(AccountResponseDto::accountToDto($account));
    }

    /**
     * @param AccountUpdateRequestDto $accountUpdateRequestDto
     * @return DataResponse<AccountResponseDto>
     * @throws OCSBadRequestException | OCSException
     */
    public function update(AccountUpdateRequestDto $accountUpdateRequestDto): DataResponse
    {

        $account = $this->accountMapper->find(
            column: "secret",
            value: $accountUpdateRequestDto->secret,
            userId: $this->userId
        );

        if ($account === null) throw new OCSBadRequestException("This account does not exist");
        if ($account->getDeletedAt() !== null) throw new OCSBadRequestException("This account has been deleted");

        $account->setName($accountUpdateRequestDto->name);
        $account->setIssuer($accountUpdateRequestDto->issuer);
        $account->setDigits($accountUpdateRequestDto->digits);
        $account->setType($accountUpdateRequestDto->type);
        $account->setPeriod($accountUpdateRequestDto->period);
        $account->setAlgorithm(OtpAlgorithm::convertToInt($accountUpdateRequestDto->algorithm));
        if ($account->getCounter() === null) $account->setCounter(-1);
        $account->setUpdatedAt(date("Y-m-d H:i:s"));

        $account = $this->accountMapper->update($account);

        return new DataResponse(AccountResponseDto::accountToDto($account));
    }

    /**
     * @param AccountDeleteRequestDto $accountDeleteRequestDto
     * @return DataResponse<null>
     * @throws OCSBadRequestException | OCSException
     */
    public function delete(AccountDeleteRequestDto $accountDeleteRequestDto): DataResponse
    {
        $account = $this->accountMapper->find(
            column: "id",
            value: $accountDeleteRequestDto->id,
            userId: $this->userId
        );

        if ($account === null) {
            throw new OCSBadRequestException("This account does not exist");
        }

        // delete shares
        $this->sharedAccountMapper->destroy($account);

        $this->accountMapper->safeDelete($account);

        return new DataResponse(null);
    }

    /**
     * @param AccountImportRequestDto $accountImportRequestDto
     * @return DataResponse<null>
     * @throws OCSBadRequestException | OCSException
     */
    public function import(AccountImportRequestDto $accountImportRequestDto): DataResponse
    {
        foreach ($accountImportRequestDto->accounts as $importedAccount) {
            if ($accountImportRequestDto->iv !== null) {
                $decryptedSecret = $this->encryption->decrypt(
                    data: $importedAccount->secret,
                    password: $accountImportRequestDto->passwordUsedOnExport,
                    iv: $accountImportRequestDto->iv
                );
                if ($decryptedSecret === false) throw new OCSBadRequestException("Incorrect password");

                $importedAccount->secret = $decryptedSecret;
            }

            $encryptedSecret = $this->encryption->encrypt(
                data: strtoupper($importedAccount->secret),
                password: $accountImportRequestDto->currentPassword,
                userId: $this->userId,
                isAlreadyHashed: true
            );
            if ($encryptedSecret === false) throw new OCSException("There was an error while importing accounts");

            $importedAccount->secret = $encryptedSecret;

            try {
                $this->create($importedAccount);
            } catch (OCSBadRequestException|OCSException) {}

        }

        return new DataResponse(null);
    }

    /**
     * @param AccountUpdateCounterRequestDto $accountUpdateCounterRequestDto
     * @return DataResponse<AccountResponseDto>
     * @throws OCSBadRequestException | OCSException
     */
    public function updateCounter(AccountUpdateCounterRequestDto $accountUpdateCounterRequestDto): DataResponse
    {
        $account = $this->accountMapper->find(
            column: "id",
            value: $accountUpdateCounterRequestDto->id,
            userId: $this->userId
        );

        if ($account === null) throw new OCSBadRequestException("This account does not exist");
        if ($account->getType() === OtpType::TOTP->value) throw new OCSBadRequestException("You cannot update counter of a TOTP account");

        $account->setCounter($account->getCounter() + 1);
        $account = $this->accountMapper->update($account);

        return new DataResponse(AccountResponseDto::accountToDto($account));
    }
}
<?php

declare(strict_types=1);

namespace OCA\OtpManager\Service;

use OCA\OtpManager\Db\Account;
use OCA\OtpManager\Db\AccountMapper;
use OCA\OtpManager\Db\SharedAccountMapper;
use OCA\OtpManager\Dto\Request\Sync\AccountSyncRequestDto;
use OCA\OtpManager\Dto\Request\Sync\SharedAccountSyncRequestDto;
use OCA\OtpManager\Dto\Request\Sync\SyncUpdateRequestDto;
use OCA\OtpManager\Dto\Response\AccountResponseDto;
use OCA\OtpManager\Dto\Response\SharedAccountResponseDto;
use OCA\OtpManager\Dto\Response\Sync\SyncAccountsResponseDto;
use OCA\OtpManager\Dto\Response\Sync\SyncResponseDto;
use OCA\OtpManager\Dto\Response\Sync\SyncSharedAccountsResponseDto;
use OCA\OtpManager\Utils\AccountPositionHelper;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\OCS\OCSException;
use OCP\DB\Exception;

class SyncService
{

    public function __construct(
        private readonly AccountMapper       $accountMapper,
        private readonly SharedAccountMapper $sharedAccountMapper,
        private readonly ?string             $userId = null
    )
    {
    }

    /**
     * @param SyncUpdateRequestDto $syncUpdateRequestDto
     * @return DataResponse<SyncResponseDto>
     * @throws OCSException
     */
    public function update(SyncUpdateRequestDto $syncUpdateRequestDto): DataResponse
    {
        return new DataResponse(
            new SyncResponseDto(
                accounts: $this->syncAccounts($syncUpdateRequestDto->accounts),
                sharedAccounts: $this->syncSharedAccounts($syncUpdateRequestDto->sharedAccounts)
            )
        );
    }

    /**
     * To compare local accounts with server accounts it runs two steps:
     *     - loop local accounts by searching in DB
     *     - loop server accounts by searching through local accounts
     * @param AccountSyncRequestDto[] $localAccounts
     * @return SyncAccountsResponseDto
     * @throws OCSException
     */
    public function syncAccounts(array $localAccounts): SyncAccountsResponseDto
    {
//        $ris = ["toAdd" => [], "toDelete" => [], "toEdit" => []];
        $ris = new SyncAccountsResponseDto(toAdd: [], toEdit: [], toDelete: []);

        // local accounts | server accounts
        // check if there are accounts that have to be:
        //	  - added on server: "isNew" => true && it is not in DB
        //	  - recovered from trash: "isNew" => true && there is in DB and "deleted_at" != null
        //    - deleted on local: local account is not in DB || there is in DB and "deleted_at" != null
        //	  - deleted on server: "deleted" => true
        //    - edited on server: "toUpdate" => true && it is not deleted on DB
        foreach ($localAccounts as $localAccount) {
            $serverAccount = $this->accountMapper->find(
                column: "secret",
                value: $localAccount->secret,
                userId: $this->userId
            );

            if ($localAccount->deleted) {
                if ($serverAccount !== null) {
                    $serverAccount->setPosition(null);
                    $serverAccount->setDeletedAt(date("Y-m-d H:i:s"));
                    $this->accountMapper->update($serverAccount);
                }
            } else if ($localAccount->isNew) {
                $position = $this->adjustPosition($localAccount->position);

                if ($serverAccount !== null) {
                    if ($serverAccount->getDeletedAt() !== null) {
                        $serverAccount->setName($localAccount->name);
                        $serverAccount->setIssuer($localAccount->issuer);
                        $serverAccount->setDigits($localAccount->digits);
                        $serverAccount->setType($localAccount->type);
                        $serverAccount->setPeriod($localAccount->period);
                        $serverAccount->setAlgorithm($localAccount->algorithm);
                        $serverAccount->setCounter($localAccount->counter);
                        $serverAccount->setIcon($localAccount->icon ?? "default");
                        $serverAccount->setPosition($position);
                        $serverAccount->setDeletedAt(null);
                        $serverAccount->setUpdatedAt(date("Y-m-d H:i:s"));
                        $this->accountMapper->update($serverAccount);
                    } else {
                        // same account has been added by other device and you didn't refreshed
                        $localAccount->toUpdate = true;
                    }
                } else {
                    $account = new Account();

                    $account->setSecret($localAccount->secret);
                    $account->setName($localAccount->name);
                    $account->setIssuer($localAccount->issuer);
                    $account->setDigits($localAccount->digits);
                    $account->setType($localAccount->type);
                    $account->setPeriod($localAccount->period);
                    $account->setAlgorithm($localAccount->algorithm);
                    $account->setCounter($localAccount->counter);
                    $account->setIcon($localAccount->icon ?? "default");
                    $account->setPosition($position);
                    $account->setUserId($this->userId);
                    $account->setCreatedAt(date("Y-m-d H:i:s"));
                    $account->setUpdatedAt(date("Y-m-d H:i:s"));

                    $this->accountMapper->insert($account);
                }
            } else if ($serverAccount == null || $serverAccount->getDeletedAt() != null) {
                $ris->toDelete[] = $localAccount->id;
            }

            if ($localAccount->toUpdate && $serverAccount !== null && $serverAccount->getDeletedAt() === null) {
                $account = $serverAccount;

                $account->setSecret($localAccount->secret);
                $account->setName($localAccount->name);
                $account->setIssuer($localAccount->issuer);
                $account->setDigits($localAccount->digits);
                $account->setType($localAccount->type);
                $account->setPeriod($localAccount->period);
                $account->setAlgorithm($localAccount->algorithm);
                $account->setCounter($localAccount->counter);
                $account->setIcon($localAccount->icon ?? "default");
                $account->setPosition($localAccount->position);
                $account->setUpdatedAt(date("Y-m-d H:i:s"));

                $this->accountMapper->update($account);
            }
        }

        // server accounts | local accounts
        // check if there are accounts that have to be:
        //	  - added on local: it is not in local side
        //    - edited on local: it is in local side && some fields have been edited (ex: another device have edited the name of google account)
        foreach ($this->accountMapper->findAllByUser($this->userId) as $serverAccount) {
            $found = false;
            $toEdit = false;

            foreach ($localAccounts as $localAccount) {
                if ($serverAccount->getSecret() == $localAccount->secret) {

                    if ($serverAccount->getName() != $localAccount["name"]) $toEdit = true;
                    else if ($serverAccount->getIssuer() != $localAccount["issuer"]) $toEdit = true;
                    else if ($serverAccount->getDigits() != $localAccount["digits"]) $toEdit = true;
                    else if ($serverAccount->getType() != $localAccount["type"]) $toEdit = true;
                    else if ($serverAccount->getPeriod() != $localAccount["period"]) $toEdit = true;
                    else if ($serverAccount->getAlgorithm() != $localAccount["algorithm"]) $toEdit = true;
                    else if ($serverAccount->getCounter() != $localAccount["counter"]) $toEdit = true;
                    else if ($serverAccount->getIcon() != ($localAccount["icon"] ?? "default")) $toEdit = true;
                    else if ($serverAccount->getPosition() != $localAccount["position"]) $toEdit = true;

                    $found = true;
                    break;
                }
            }

            if (!$found) {
                $ris->toAdd[] = AccountResponseDto::accountToDto($serverAccount);
            } else if ($toEdit) {
                $ris->toEdit[] = AccountResponseDto::accountToDto($serverAccount);
            }
        }

        return $ris;
    }

    /**
     * To compare local accounts with server accounts it runs two steps:
     *     - loop local accounts by searching in DB
     *     - loop server accounts by searching through local accounts
     * @param SharedAccountSyncRequestDto[] $localAccounts
     * @return SyncSharedAccountsResponseDto
     * @throws OCSException
     */
    public function syncSharedAccounts(array $localAccounts): SyncSharedAccountsResponseDto
    {
        $ris = new SyncSharedAccountsResponseDto(toAdd: [], toEdit: [], toDelete: []);
//        $ris = ["toAdd" => [], "toDelete" => [], "toEdit" => []];

        // local accounts | server accounts
        // check if there are accounts that have to be:
        //    - deleted on local: local account is not in DB
        //	  - deleted on server: "deleted" => true
        //    - edited on server: "toUpdate" => true
        foreach ($localAccounts as $localAccount) {
            $serverAccount = $this->sharedAccountMapper->find(
                column: "account_id",
                value: $localAccount->accountId,
                receiverId: $this->userId
            );

            if ($serverAccount == null) {
                $ris->toDelete[] = $localAccount->id;
            } else if ($localAccount->deleted) {
                $this->sharedAccountMapper->delete($serverAccount);
            } else if ($localAccount->toUpdate) {
                $sharedAccount = $serverAccount;

                $sharedAccount->setName($localAccount->name);
                $sharedAccount->setIssuer($localAccount->issuer);
                $sharedAccount->setUnlocked($localAccount->unlocked);
                $sharedAccount->setIcon($localAccount->icon ?? "default");
                $sharedAccount->setPosition($localAccount->position);
                $sharedAccount->setUpdatedAt(date("Y-m-d H:i:s"));

                $this->sharedAccountMapper->update($sharedAccount);
            }
        }

        // server accounts | local accounts
        // check if there are accounts that have to be:
        //	  - added on local: it is not in local side
        //    - edited on local: it is in local side && some fields have been edited (ex: another device have edited the name of google account)
        foreach ($this->sharedAccountMapper->findAllByReceiverJoin($this->userId) as $serverAccount) {
            $found = false;
            $toEdit = false;

            foreach ($localAccounts as $localAccount) {
                if ($serverAccount["account_id"] == $localAccount->accountId) {

                    if ($serverAccount["secret"] != $localAccount->secret) $toEdit = true;
                    else if ($serverAccount["name"] != $localAccount->name) $toEdit = true;
                    else if ($serverAccount["issuer"] != $localAccount->issuer) $toEdit = true;
                    else if ($serverAccount["unlocked"] != $localAccount->unlocked) $toEdit = true;
                    else if ($serverAccount["icon"] != ($localAccount->icon ?? "default")) $toEdit = true;
                    else if ($serverAccount["position"] != $localAccount->position) $toEdit = true;
                    else if ($serverAccount["expired_at"] != $localAccount->expiredAt) $toEdit = true;

                    $found = true;
                    break;
                }
            }

            if (!$found) {
                $ris->toAdd[] = SharedAccountResponseDto::sharedAccountToDto($serverAccount);
            } else if ($toEdit) {
                $ris->toEdit[] = SharedAccountResponseDto::sharedAccountToDto($serverAccount);
            }
        }

        return $ris;
    }

    /**
     * @param int $pos
     * @return int
     * @throws OCSException
     */
    private function adjustPosition(int $pos): int
    {
        AccountPositionHelper::increasePosition($this->accountMapper, $this->accountMapper->findAllPosGtThan($pos, $this->userId), $pos);
        AccountPositionHelper::increasePosition($this->sharedAccountMapper, $this->sharedAccountMapper->findAllPosGtThan($pos, $this->userId), $pos);

        $lastPosition = max(
            $this->sharedAccountMapper->findMaxPosition($this->userId),
            $this->accountMapper->findMaxPosition($this->userId)
        );

        return $lastPosition + 1;
    }
}
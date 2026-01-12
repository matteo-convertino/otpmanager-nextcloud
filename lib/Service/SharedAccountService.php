<?php

declare(strict_types=1);

namespace OCA\OtpManager\Service;

use OCA\OtpManager\Db\AccountMapper;
use OCA\OtpManager\Db\SharedAccount;
use OCA\OtpManager\Db\SharedAccountMapper;
use OCA\OtpManager\Dto\Request\Account\AccountUpdateCounterRequestDto;
use OCA\OtpManager\Dto\Request\SharedAccount\SharedAccountCreateRequestDto;
use OCA\OtpManager\Dto\Request\SharedAccount\SharedAccountDeleteRequestDto;
use OCA\OtpManager\Dto\Request\SharedAccount\SharedAccountGetRequestDto;
use OCA\OtpManager\Dto\Request\SharedAccount\SharedAccountUnlockRequestDto;
use OCA\OtpManager\Dto\Request\SharedAccount\SharedAccountUpdateRequestDto;
use OCA\OtpManager\Dto\Response\AccountResponseDto;
use OCA\OtpManager\Dto\Response\ReceiverResponseDto;
use OCA\OtpManager\Dto\Response\SharedAccountResponseDto;
use OCA\OtpManager\Utils\OtpType;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\OCS\OCSBadRequestException;
use OCP\AppFramework\OCS\OCSException;
use OCP\IRequest;
use OCP\IUserManager;

class SharedAccountService
{

    private readonly string $serverUrl;

    public function __construct(
        IRequest                             $request,
        private readonly IUserManager        $userManager,
        private readonly SharedAccountMapper $sharedAccountMapper,
        private readonly AccountMapper       $accountMapper,
        private readonly EncryptionService   $encryption,
        private readonly ?string             $userId = null,
    )
    {
        $this->serverUrl = $request->getServerProtocol() . "://" . $request->getServerHost() . "/";
    }

    /**
     * @return DataResponse<SharedAccountResponseDto[]>
     * @throws OCSException
     */
    public function getByUser(): DataResponse
    {
        return new DataResponse(
            SharedAccountResponseDto::sharedAccountToDto($this->sharedAccountMapper->findAllByReceiverJoin($this->userId))
        );
    }

    /**
     * @param SharedAccountGetRequestDto $sharedAccountGetRequestDto
     * @return DataResponse<SharedAccountResponseDto[]>
     * @throws OCSException
     */
    public function getByAccount(SharedAccountGetRequestDto $sharedAccountGetRequestDto): DataResponse
    {
        $sharedAccounts = $this->sharedAccountMapper->findAllByAccount($sharedAccountGetRequestDto->accountId);

        $activeShares = [];

        foreach ($sharedAccounts as $activeShare) {
            $receiver = $this->userManager->get($activeShare->getReceiverId());

            if ($receiver === null) continue;

            $activeShares[] = SharedAccountResponseDto::sharedAccountEntityToDto(
                sharedAccount: $activeShare,
                receiver: new ReceiverResponseDto(
                    id: $receiver->getUID(),
                    label: $receiver->getDisplayName(),
                    value: $receiver->getUID(),
                    image: $this->serverUrl . "avatar/{$receiver->getUID()}/64",
                )
            );
        }

        return new DataResponse($activeShares);
    }

    /**
     * @param SharedAccountCreateRequestDto $sharedAccountCreateRequestDto
     * @return DataResponse<null>
     * @throws OCSException
     */
    public function create(SharedAccountCreateRequestDto $sharedAccountCreateRequestDto): DataResponse
    {
        $account = $this->accountMapper->find(
            column: "secret",
            value: $sharedAccountCreateRequestDto->accountSecret,
            userId: $this->userId
        );

        if ($account === null) {
            throw new OCSBadRequestException("The account to share does not exist");
        } else if ($account->getUserId() != $this->userId) {
            throw new OCSBadRequestException("You cannot share an account if you are not the owner");
        }

        foreach ($sharedAccountCreateRequestDto->users as $receiverId) {
            $accountShared = $this->sharedAccountMapper->findByReceiver(
                accountId: $account->getId(),
                receiverId: $receiverId
            );

            $expirationDate = $sharedAccountCreateRequestDto->expirationDate == null ?
                null :
                date('Y-m-d', strtotime($sharedAccountCreateRequestDto->expirationDate));

            if ($accountShared === null) {
                $accountShared = new SharedAccount();

                $maxSharedAccountPos = $this->sharedAccountMapper->findMaxPosition($receiverId);
                $maxAccountPos = $this->accountMapper->findMaxPosition($receiverId);

                $position = max($maxSharedAccountPos, $maxAccountPos) + 1;

                $accountShared->setAccountId($account->getId());
                $accountShared->setReceiverId($receiverId);
                $accountShared->setName($account->getName());
                $accountShared->setIssuer($account->getIssuer());
                $accountShared->setSecret($sharedAccountCreateRequestDto->sharedSecret);
                $accountShared->setPassword(
                    password_hash($sharedAccountCreateRequestDto->password, PASSWORD_DEFAULT)
                );
                $accountShared->setIv($sharedAccountCreateRequestDto->iv);
                $accountShared->setIcon($account->getIcon());
                $accountShared->setPosition($position);
                $accountShared->setExpiredAt($expirationDate);
                $accountShared->setCreatedAt(date("Y-m-d H:i:s"));
                $accountShared->setUpdatedAt(date("Y-m-d H:i:s"));

                $this->sharedAccountMapper->insert($accountShared);
            } else {
                $accountShared->setPassword(
                    password_hash($sharedAccountCreateRequestDto->password, PASSWORD_DEFAULT)
                );
                $accountShared->setIv($sharedAccountCreateRequestDto->iv);
                $accountShared->setExpiredAt($expirationDate);
                $this->sharedAccountMapper->update($accountShared);
            }
        }

        return new DataResponse(null);
    }

    /**
     * @param SharedAccountUpdateRequestDto $sharedAccountUpdateRequestDto
     * @return DataResponse<SharedAccountResponseDto>
     * @throws OCSBadRequestException | OCSException
     */
    public function update(SharedAccountUpdateRequestDto $sharedAccountUpdateRequestDto): DataResponse
    {
        $sharedAccount = $this->sharedAccountMapper->find(
            column: "secret",
            value: $sharedAccountUpdateRequestDto->secret,
            receiverId: $this->userId
        );

        if ($sharedAccount == null) throw new OCSBadRequestException("This account does not exists");

        $sharedAccount->setName($sharedAccountUpdateRequestDto->name);
        $sharedAccount->setIssuer($sharedAccountUpdateRequestDto->issuer);

        return new DataResponse(
            SharedAccountResponseDto::sharedAccountToDto($this->sharedAccountMapper->update($sharedAccount))
        );
    }

    /**
     * @param SharedAccountDeleteRequestDto $sharedAccountDeleteRequestDto
     * @return DataResponse<null>
     * @throws OCSException
     */
    public function delete(SharedAccountDeleteRequestDto $sharedAccountDeleteRequestDto): DataResponse
    {
//        $receiverId = $this->request->getParam("receiver");

        $this->sharedAccountMapper->unshare(
            accountId: $sharedAccountDeleteRequestDto->accountId,
            receiverId: $sharedAccountDeleteRequestDto->receiverId == null ?
                $this->userId :
                $sharedAccountDeleteRequestDto->receiverId
        );

        return new DataResponse(null);

    }

    /**
     * @param SharedAccountGetRequestDto $sharedAccountGetUsersRequestDto
     * @return DataResponse<ReceiverResponseDto[]>
     * @throws OCSException
     */
    public function getUsers(SharedAccountGetRequestDto $sharedAccountGetUsersRequestDto): DataResponse
    {
        $result = $this->sharedAccountMapper->findUsers(
            userId: $this->userId,
            accountId: $sharedAccountGetUsersRequestDto->accountId
        );

        $receivers = array_map(function ($user) {
            $uid = $user['uid'];

            return new ReceiverResponseDto(
                id: $uid,
                label: $user['displayname'] ?? $uid,
                value: $uid,
                image: $this->serverUrl . "avatar/$uid/64",
            );
        }, $result);

        return new DataResponse($receivers);
    }

    /**
     * @param SharedAccountUnlockRequestDto $sharedAccountUnlockRequestDto
     * @return DataResponse<null>
     * @throws OCSBadRequestException | OCSException
     */
    public function unlock(SharedAccountUnlockRequestDto $sharedAccountUnlockRequestDto): DataResponse
    {
        $accountShared = $this->sharedAccountMapper->findByReceiver(
            accountId: $sharedAccountUnlockRequestDto->accountId,
            receiverId: $this->userId
        );

        if ($accountShared == null)
            throw new OCSBadRequestException("This shared account does not exists");

        if ($accountShared->getUnlocked())
            return new DataResponse(null);

        if (!password_verify(hash("sha256", $sharedAccountUnlockRequestDto->tempPassword), $accountShared->getPassword()))
            throw new OCSBadRequestException("The password is incorrect");

        $decryptedSecret = $this->encryption->decrypt(
            data: $accountShared->getSecret(),
            password: $sharedAccountUnlockRequestDto->tempPassword,
            iv: $accountShared->getIv()
        );

        if ($decryptedSecret === false)
            throw new OCSException("There was an error while trying to decrypt the secret key", 500);

        $encryptedSecret = $this->encryption->encrypt(
            data: $decryptedSecret,
            password: $sharedAccountUnlockRequestDto->currentPassword,
            userId: $this->userId,
            isAlreadyHashed: true
        );

        if ($encryptedSecret === false)
            throw new OCSException("There was an error while trying to encrypt the secret key", 500);

        $accountShared->setSecret($encryptedSecret);
        $accountShared->setUnlocked(true);
        $this->sharedAccountMapper->update($accountShared);

        return new DataResponse(null);
    }

    /**
     * @param AccountUpdateCounterRequestDto $accountUpdateCounterRequestDto
     * @return DataResponse<AccountResponseDto>
     * @throws OCSBadRequestException | OCSException
     */
    public function updateCounter(AccountUpdateCounterRequestDto $accountUpdateCounterRequestDto): DataResponse
    {
        $account = $this->sharedAccountMapper->findAccountBySecret(
            receiverId: $this->userId,
            secret: $accountUpdateCounterRequestDto->secret
        );

        if ($account == null)
            throw new OCSBadRequestException("This account does not exists");
        if ($account->getType() == OtpType::TOTP->value)
            throw new OCSBadRequestException("You cannot update counter of a TOTP account");

        $account->setCounter($account->getCounter() + 1);
        $this->accountMapper->update($account);

        return new DataResponse(AccountResponseDto::accountToDto($account));
    }
}
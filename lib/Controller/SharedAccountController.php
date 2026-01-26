<?php

declare(strict_types=1);

namespace OCA\OtpManager\Controller;

use OCA\OtpManager\Attribute\ValidateRequestBodyDTO;
use OCA\OtpManager\Dto\Request\Account\AccountUpdateCounterRequestDto;
use OCA\OtpManager\Dto\Request\SharedAccount\SharedAccountCreateRequestDto;
use OCA\OtpManager\Dto\Request\SharedAccount\SharedAccountDeleteRequestDto;
use OCA\OtpManager\Dto\Request\SharedAccount\SharedAccountGetRequestDto;
use OCA\OtpManager\Dto\Request\SharedAccount\SharedAccountUnlockRequestDto;
use OCA\OtpManager\Dto\Request\SharedAccount\SharedAccountUpdateRequestDto;
use OCA\OtpManager\Dto\Response\AccountResponseDto;
use OCA\OtpManager\Dto\Response\ReceiverResponseDto;
use OCA\OtpManager\Dto\Response\SharedAccountResponseDto;
use OCA\OtpManager\Service\SharedAccountService;
use OCP\AppFramework\Http\Attribute\ApiRoute;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\NoCSRFRequired;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\OCS\OCSBadRequestException;
use OCP\AppFramework\OCS\OCSException;
use OCP\AppFramework\OCSController;
use OCP\IRequest;
use Psr\Log\LoggerInterface;

class SharedAccountController extends OCSController
{

    public function __construct(
        string                                $appName,
        IRequest                              $request,
        private readonly SharedAccountService $sharedAccountService,
        private readonly LoggerInterface $logger,
    )
    {
        parent::__construct($appName, $request);
    }

    /**
     * @return DataResponse<SharedAccountResponseDto[]>
     * @throws OCSException
     */
    #[NoAdminRequired]
    #[NoCSRFRequired]
    #[ApiRoute(verb: 'GET', url: '/share')]
    public function getByUser(): DataResponse
    {
        return $this->sharedAccountService->getByUser();
    }

    /**
     * @param int $accountId
     * @return DataResponse<SharedAccountResponseDto[]>
     * @throws OCSException
     */
    #[NoAdminRequired]
    #[NoCSRFRequired]
    #[ApiRoute(verb: 'GET', url: '/share/{accountId}')]
//    #[ValidateRequestBodyDTO(SharedAccountGetRequestDto::class)]
    public function getByAccount(int $accountId): DataResponse
    {
        return $this->sharedAccountService->getByAccount(new SharedAccountGetRequestDto($accountId));
    }

    /**
     * @param string $accountSecret
     * @param string[] $users
     * @param string $sharedSecret
     * @param string $password
     * @param string $iv
     * @param string|null $expirationDate
     * @return DataResponse<null>
     * @throws OCSException
     */
    #[NoAdminRequired]
    #[ApiRoute(verb: 'POST', url: '/share')]
    #[ValidateRequestBodyDTO(SharedAccountCreateRequestDto::class)]
    public function create(
        array   $users,
        string  $accountSecret,
        string  $sharedSecret,
        string  $password,
        string  $iv,
        ?string $expirationDate
    ): DataResponse
    {
        return $this->sharedAccountService->create(
            new SharedAccountCreateRequestDto(
                users: $users,
                accountSecret: $accountSecret,
                sharedSecret: $sharedSecret,
                password: $password,
                iv: $iv,
                expirationDate: $expirationDate
            )
        );
    }

    /**
     * @param string $name
     * @param string $issuer
     * @param string $secret
     * @return DataResponse
     * @throws OCSBadRequestException
     * @throws OCSException
     */
    #[NoAdminRequired]
    #[ApiRoute(verb: 'PUT', url: '/share')]
    #[ValidateRequestBodyDTO(SharedAccountUpdateRequestDto::class)]
    public function update(string $name, string $issuer, string $secret): DataResponse
    {
        return $this->sharedAccountService->update(
            new SharedAccountUpdateRequestDto(
                name: $name,
                issuer: $issuer,
                secret: $secret
            )
        );
    }

    /**
     * @param int $accountId
     * @param string|null $receiverId
     * @return DataResponse
     * @throws OCSException
     */
    #[NoAdminRequired]
    #[ApiRoute(verb: 'DELETE', url: '/share/{accountId}')]
    public function delete(int $accountId, ?string $receiverId): DataResponse
    {
        return $this->sharedAccountService->delete(
            new SharedAccountDeleteRequestDto(
                accountId: $accountId,
                receiverId: $receiverId
            )
        );
    }

    /**
     * @param int $accountId
     * @return DataResponse<ReceiverResponseDto[]>
     * @throws OCSException
     */
    #[NoAdminRequired]
    #[NoCSRFRequired]
    #[ApiRoute(verb: 'GET', url: '/get-users/{accountId}')]
    public function getUsers(int $accountId): DataResponse
    {
        return $this->sharedAccountService->getUsers(new SharedAccountGetRequestDto($accountId));
    }

    /**
     * @param int $accountId
     * @param string $currentPassword
     * @param string $tempPassword
     * @return DataResponse<null>
     * @throws OCSBadRequestException
     * @throws OCSException
     */
    #[NoAdminRequired]
    #[ApiRoute(verb: 'POST', url: '/share/unlock')]
    #[ValidateRequestBodyDTO(SharedAccountUnlockRequestDto::class)]
    public function unlock(int $accountId, string $currentPassword, string $tempPassword): DataResponse
    {
        return $this->sharedAccountService->unlock(
            new SharedAccountUnlockRequestDto(
                accountId: $accountId,
                currentPassword: $currentPassword,
                tempPassword: $tempPassword
            )
        );
    }

    /**
     * @param int $id
     * @return DataResponse<AccountResponseDto>
     * @throws OCSBadRequestException
     * @throws OCSException
     */
    #[NoAdminRequired]
    #[ApiRoute(verb: 'POST', url: '/share/update-counter')]
    #[ValidateRequestBodyDTO(AccountUpdateCounterRequestDto::class)]
    public function updateCounter(int $id): DataResponse
    {
        return $this->sharedAccountService->updateCounter(new AccountUpdateCounterRequestDto($id));
    }
}

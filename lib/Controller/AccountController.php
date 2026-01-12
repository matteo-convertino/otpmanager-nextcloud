<?php

declare(strict_types=1);

namespace OCA\OtpManager\Controller;

use OCA\OtpManager\Attribute\ValidateRequestBodyDTO;
use OCA\OtpManager\Dto\Request\Account\AccountCreateRequestDto;
use OCA\OtpManager\Dto\Request\Account\AccountDeleteRequestDto;
use OCA\OtpManager\Dto\Request\Account\AccountGetRequestDto;
use OCA\OtpManager\Dto\Request\Account\AccountImportRequestDto;
use OCA\OtpManager\Dto\Request\Account\AccountUpdateCounterRequestDto;
use OCA\OtpManager\Dto\Request\Account\AccountUpdateRequestDto;
use OCA\OtpManager\Dto\Response\AccountResponseDto;
use OCA\OtpManager\Dto\Response\SharedAccountResponseDto;
use OCA\OtpManager\Service\AccountService;
use OCP\AppFramework\Http\Attribute\ApiRoute;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\NoCSRFRequired;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\OCS\OCSBadRequestException;
use OCP\AppFramework\OCS\OCSException;
use OCP\AppFramework\OCSController;
use OCP\IRequest;

class AccountController extends OCSController
{

    public function __construct(
        string                          $appName,
        IRequest                        $request,
        private readonly AccountService $accountService,
    )
    {
        parent::__construct($appName, $request);
    }

    /**
     * @param int $id
     * @return DataResponse<AccountResponseDto | null>
     */
    #[NoAdminRequired]
    #[NoCSRFRequired]
    #[ApiRoute(verb: 'GET', url: '/accounts/{id}')]
    #[ValidateRequestBodyDTO(AccountGetRequestDto::class)]
    public function get(int $id): DataResponse
    {
        return $this->accountService->get(new AccountGetRequestDto($id));
    }

    /**
     * @return DataResponse<SharedAccountResponseDto[]>
     * @throws OCSException
     */
    #[NoAdminRequired]
    #[NoCSRFRequired]
    #[ApiRoute(verb: 'GET', url: '/accounts')]
    public function getAll(): DataResponse
    {
        return $this->accountService->getAll();
    }

    /**
     * @param string $name
     * @param string $issuer
     * @param string $secret
     * @param string $type
     * @param int $period
     * @param string $algorithm
     * @param int $digits
     * @param int|null $counter
     * @return DataResponse<AccountResponseDto>
     * @throws OCSException
     * @throws OCSBadRequestException
     */
    #[NoAdminRequired]
    #[ApiRoute(verb: 'POST', url: '/accounts')]
    #[ValidateRequestBodyDTO(AccountCreateRequestDto::class)]
    public function create(
        string $name,
        string $issuer,
        string $secret,
        string $type,
        int    $period,
        string $algorithm,
        int    $digits,
        ?int   $counter
    ): DataResponse
    {
        return $this->accountService->create(
            new AccountCreateRequestDto(
                name: $name,
                issuer: $issuer,
                secret: $secret,
                type: $type,
                period: $period,
                algorithm: $algorithm,
                digits: $digits,
                counter: $counter
            )
        );
    }

    /**
     * @param string $name
     * @param string $issuer
     * @param string $secret
     * @param string $type
     * @param int $period
     * @param string $algorithm
     * @param int $digits
     * @return DataResponse<AccountResponseDto>
     * @throws OCSBadRequestException
     * @throws OCSException
     */
    #[NoAdminRequired]
    #[ApiRoute(verb: 'PUT', url: '/accounts')]
    #[ValidateRequestBodyDTO(AccountUpdateRequestDto::class)]
    public function update(
        string $name,
        string $issuer,
        string $secret,
        string $type,
        int    $period,
        string $algorithm,
        int    $digits
    ): DataResponse
    {
        return $this->accountService->update(
            new AccountUpdateRequestDto(
                name: $name,
                issuer: $issuer,
                secret: $secret,
                type: $type,
                period: $period,
                algorithm: $algorithm,
                digits: $digits
            )
        );
    }

    /**
     * @param int $id
     * @return DataResponse<null>
     * @throws OCSBadRequestException
     * @throws OCSException
     */
    #[NoAdminRequired]
    #[ApiRoute(verb: 'DELETE', url: '/accounts/{id}')]
    #[ValidateRequestBodyDTO(AccountDeleteRequestDto::class)]
    public function delete(int $id): DataResponse
    {
        return $this->accountService->delete(new AccountDeleteRequestDto($id));
    }

    /**
     * @param AccountCreateRequestDto[] $accounts
     * @param string|null $iv
     * @param string|null $passwordUsedOnExport
     * @param string $currentPassword
     * @return DataResponse<null>
     * @throws OCSBadRequestException
     * @throws OCSException
     */
    #[NoAdminRequired]
    #[ApiRoute(verb: 'POST', url: '/accounts/import')]
    #[ValidateRequestBodyDTO(AccountImportRequestDto::class)]
    public function import(
        array   $accounts,
        ?string $iv,
        ?string $passwordUsedOnExport,
        string  $currentPassword
    ): DataResponse
    {
        return $this->accountService->import(
            new AccountImportRequestDto(
                accounts: $accounts,
                iv: $iv,
                passwordUsedOnExport: $passwordUsedOnExport,
                currentPassword: $currentPassword
            )
        );
    }

    /**
     * @param string $secret
     * @return DataResponse<AccountResponseDto>
     * @throws OCSBadRequestException
     * @throws OCSException
     */
    #[NoAdminRequired]
    #[ApiRoute(verb: 'POST', url: '/accounts/update-counter')]
    #[ValidateRequestBodyDTO(AccountUpdateCounterRequestDto::class)]
    public function updateCounter(string $secret): DataResponse
    {
        return $this->accountService->updateCounter(
            new AccountUpdateCounterRequestDto($secret)
        );
    }
}

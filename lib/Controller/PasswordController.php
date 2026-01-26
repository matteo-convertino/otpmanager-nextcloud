<?php

declare(strict_types=1);

namespace OCA\OtpManager\Controller;

use OCA\OtpManager\Attribute\ValidateRequestBodyDTO;
use OCA\OtpManager\Dto\Request\Password\PasswordCheckRequestDto;
use OCA\OtpManager\Dto\Request\Password\PasswordCreateRequestDto;
use OCA\OtpManager\Dto\Request\Password\PasswordUpdateRequestDto;
use OCA\OtpManager\Dto\Response\Password\PasswordResponseDto;
use OCA\OtpManager\Dto\Response\Password\PasswordStatusResponseDto;
use OCA\OtpManager\Service\PasswordService;
use OCP\AppFramework\Http\Attribute\ApiRoute;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\NoCSRFRequired;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\OCS\OCSBadRequestException;
use OCP\AppFramework\OCS\OCSException;
use OCP\AppFramework\OCSController;
use OCP\IRequest;


class PasswordController extends OCSController
{

    public function __construct(
        string                           $appName,
        IRequest                         $request,
        private readonly PasswordService $passwordService,
    )
    {
        parent::__construct($appName, $request);
    }

    /**
     * @param string $password
     * @return DataResponse<PasswordResponseDto>
     * @throws OCSBadRequestException
     */
    #[NoAdminRequired]
    #[NoCSRFRequired]
    #[ApiRoute(verb: 'POST', url: '/password/check')]
    #[ValidateRequestBodyDTO(PasswordCheckRequestDto::class)]
    public function check(string $password): DataResponse
    {
        return $this->passwordService->check(
            new PasswordCreateRequestDto(password: $password)
        );
    }

    /**
     * @return DataResponse<PasswordStatusResponseDto>
     * @throws OCSException
     */
    #[NoAdminRequired]
    #[NoCSRFRequired]
    #[ApiRoute(verb: 'GET', url: '/password/status')]
    public function status(): DataResponse
    {
        return $this->passwordService->status();
    }

    /**
     * @param string $password
     * @return DataResponse<PasswordResponseDto>
     * @throws OCSBadRequestException
     * @throws OCSException
     */
    #[NoAdminRequired]
    #[ApiRoute(verb: 'POST', url: '/password')]
    #[ValidateRequestBodyDTO(PasswordCreateRequestDto::class)]
    public function create(string $password): DataResponse
    {
        return $this->passwordService->create(
            new PasswordCreateRequestDto(password: $password)
        );
    }

    /**
     * @param string $oldPassword
     * @param string $newPassword
     * @return DataResponse<PasswordResponseDto>
     * @throws OCSBadRequestException
     * @throws OCSException
     */
    #[NoAdminRequired]
    #[ApiRoute(verb: 'PUT', url: '/password')]
    #[ValidateRequestBodyDTO(PasswordUpdateRequestDto::class)]
    public function update(string $oldPassword, string $newPassword): DataResponse
    {
        return $this->passwordService->update(
            new PasswordUpdateRequestDto(
                oldPassword: $oldPassword,
                newPassword: $newPassword
            )
        );
    }
}

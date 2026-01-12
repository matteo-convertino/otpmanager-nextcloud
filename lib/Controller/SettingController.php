<?php

declare(strict_types=1);

namespace OCA\OtpManager\Controller;

use OCA\OtpManager\Attribute\ValidateRequestBodyDTO;
use OCA\OtpManager\Dto\Request\SettingSaveRequestDto;
use OCA\OtpManager\Dto\Response\SettingResponseDto;
use OCA\OtpManager\Service\SettingService;
use OCP\AppFramework\Http\Attribute\ApiRoute;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\NoCSRFRequired;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\OCS\OCSException;
use OCP\AppFramework\OCSController;
use OCP\IRequest;


class SettingController extends OCSController
{
    public function __construct(
        string                          $appName,
        IRequest                        $request,
        private readonly SettingService $settingService
    )
    {
        parent::__construct($appName, $request);
    }

    /**
     * @return DataResponse<SettingResponseDto>
     */
    #[NoAdminRequired]
    #[NoCSRFRequired]
    #[ApiRoute(verb: 'GET', url: '/settings')]
    public function get(): DataResponse
    {
        return $this->settingService->get();
    }

    /**
     * @param bool|null $showCodes
     * @param bool|null $darkMode
     * @param string|null $recordsPerPage
     * @return DataResponse<SettingResponseDto>
     * @throws OCSException
     */
    #[NoAdminRequired]
    #[ApiRoute(verb: 'POST', url: '/settings')]
    #[ValidateRequestBodyDTO(SettingSaveRequestDto::class)]
    public function save(?bool $showCodes, ?bool $darkMode, ?string $recordsPerPage): DataResponse
    {
        return $this->settingService->save(
            new SettingSaveRequestDto(
                showCodes: $showCodes,
                darkMode: $darkMode,
                recordsPerPage: $recordsPerPage
            )
        );
    }
}

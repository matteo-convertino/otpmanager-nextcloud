<?php

declare(strict_types=1);

namespace OCA\OtpManager\Service;

use OCA\OtpManager\Db\SettingMapper;
use OCA\OtpManager\Dto\Request\SettingSaveRequestDto;
use OCA\OtpManager\Dto\Response\SettingResponseDto;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\OCS\OCSException;

class SettingService
{

    public function __construct(
        private readonly SettingMapper $settingMapper,
        private readonly ?string       $userId = null
    )
    {
    }

    /**
     * @return DataResponse<SettingResponseDto | null>
     */
    public function get(): DataResponse
    {
        return new DataResponse(
            SettingResponseDto::settingToDto($this->settingMapper->find($this->userId))
        );
    }

    /**
     * @param SettingSaveRequestDto $settingSaveRequestDto
     * @return DataResponse<SettingResponseDto>
     * @throws OCSException
     */
    public function save(SettingSaveRequestDto $settingSaveRequestDto): DataResponse
    {
        $setting = $this->settingMapper->find($this->userId);

        if ($settingSaveRequestDto->showCodes !== null) $setting->setShowCodes($settingSaveRequestDto->showCodes);
        if ($settingSaveRequestDto->darkMode !== null) $setting->setDarkMode($settingSaveRequestDto->darkMode);
        if ($settingSaveRequestDto->recordsPerPage !== null) $setting->setRecordsPerPage($settingSaveRequestDto->recordsPerPage);
        if ($settingSaveRequestDto->viewMode !== null) $setting->setViewMode($settingSaveRequestDto->viewMode);

        return new DataResponse(
            SettingResponseDto::settingToDto($this->settingMapper->update($setting))
        );
    }
}
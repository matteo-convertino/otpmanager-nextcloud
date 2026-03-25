<?php

declare(strict_types=1);

namespace OCA\OtpManager\Dto\Response;

use JsonSerializable;
use OCA\OtpManager\Db\Setting;
use OCA\OtpManager\Utils\OtpViewMode;

class SettingResponseDto implements JsonSerializable
{
    public function __construct(
        public readonly int    $id,
        public readonly bool   $showCodes,
        public readonly bool   $darkMode,
        public readonly string $recordsPerPage,
        public readonly OtpViewMode $viewMode,
        public readonly string $userId,
    )
    {
    }

    public static function settingToDto(Setting $setting): self
    {
        return new self(
            id: $setting->getId(),
            showCodes: $setting->getShowCodes(),
            darkMode: $setting->getDarkMode(),
            recordsPerPage: $setting->getRecordsPerPage(),
            viewMode: OtpViewMode::tryFrom($setting->getViewMode()),
            userId: $setting->getUserId(),
        );
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'showCodes' => $this->showCodes,
            'darkMode' => $this->darkMode,
            'recordsPerPage' => $this->recordsPerPage,
            'viewMode' => $this->viewMode,
            'userId' => $this->userId
        ];
    }
}
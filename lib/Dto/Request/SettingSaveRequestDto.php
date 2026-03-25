<?php

declare(strict_types=1);

namespace OCA\OtpManager\Dto\Request;

use JsonSerializable;
use OCA\OtpManager\Utils\OtpViewMode;
use Symfony\Component\Validator\Constraints as Assert;


final class SettingSaveRequestDto implements JsonSerializable
{
    public function __construct(
        public readonly ?bool   $showCodes,
        public readonly ?bool   $darkMode,
        public readonly ?string $recordsPerPage,

        #[Assert\Choice(
            callback: [OtpViewMode::class, 'values'],
            message: 'type must be one of those listed'
        )]
        public readonly ?string $viewMode
    )
    {
    }

    public function jsonSerialize(): array
    {
        return [
            'showCodes' => $this->showCodes,
            'darkMode' => $this->darkMode,
            'recordsPerPage' => $this->recordsPerPage,
            'viewMode' => $this->viewMode,
        ];
    }
}
<?php

declare(strict_types=1);

namespace OCA\OtpManager\Dto\Request;

use JsonSerializable;


final class SettingSaveRequestDto implements JsonSerializable
{
    public function __construct(
        public readonly ?bool   $showCodes,
        public readonly ?bool   $darkMode,
        public readonly ?string $recordsPerPage
    )
    {
    }

    public function jsonSerialize(): array
    {
        return [
            'showCodes' => $this->showCodes,
            'darkMode' => $this->darkMode,
            'recordsPerPage' => $this->recordsPerPage,
        ];
    }
}
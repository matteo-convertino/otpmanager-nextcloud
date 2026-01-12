<?php

declare(strict_types=1);

namespace OCA\OtpManager\Dto\Request;

use JsonSerializable;
use OCA\OtpManager\Utils\DatatablePerPageOptions;
use Symfony\Component\Validator\Constraints as Assert;


final class SettingSaveRequestDto implements JsonSerializable
{
    public function __construct(
        public readonly ?bool   $showCodes,
        public readonly ?bool   $darkMode,

        #[Assert\Choice(
            callback: [DatatablePerPageOptions::class, 'values'],
            message: 'RecordsPerPage must be one of those listed'
        )]
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
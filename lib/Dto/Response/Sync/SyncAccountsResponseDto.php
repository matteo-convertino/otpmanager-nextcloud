<?php

declare(strict_types=1);

namespace OCA\OtpManager\Dto\Response\Sync;

use JsonSerializable;
use OCA\OtpManager\Dto\Response\AccountResponseDto;

final class SyncAccountsResponseDto implements JsonSerializable
{

    /**
     * @param AccountResponseDto[] $toAdd
     * @param AccountResponseDto[] $toEdit
     * @param array<int> $toDelete
     */
    public function __construct(
        public array $toAdd,
        public array $toEdit,
        public array $toDelete
    )
    {
    }

    public function jsonSerialize(): array
    {
        return [
            'toAdd' => $this->toAdd,
            'toEdit' => $this->toEdit,
            'toDelete' => $this->toDelete
        ];
    }
}
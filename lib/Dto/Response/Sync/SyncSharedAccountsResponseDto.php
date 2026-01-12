<?php

declare(strict_types=1);

namespace OCA\OtpManager\Dto\Response\Sync;

use JsonSerializable;
use OCA\OtpManager\Dto\Response\AccountResponseDto;
use OCA\OtpManager\Dto\Response\SharedAccountResponseDto;

final class SyncSharedAccountsResponseDto implements JsonSerializable
{

    /**
     * @param SharedAccountResponseDto[] $toAdd
     * @param SharedAccountResponseDto[] $toEdit
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
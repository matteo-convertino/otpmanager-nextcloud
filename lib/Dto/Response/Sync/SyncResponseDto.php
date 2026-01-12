<?php

declare(strict_types=1);

namespace OCA\OtpManager\Dto\Response\Sync;

use JsonSerializable;

final class SyncResponseDto implements JsonSerializable
{
    public function __construct(
        public readonly SyncAccountsResponseDto       $accounts,
        public readonly SyncSharedAccountsResponseDto $sharedAccounts
    )
    {
    }

    public function jsonSerialize(): array
    {
        return [
            'accounts' => $this->accounts,
            'sharedAccounts' => $this->sharedAccounts
        ];
    }
}
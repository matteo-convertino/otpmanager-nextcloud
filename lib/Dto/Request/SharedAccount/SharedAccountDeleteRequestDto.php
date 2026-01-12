<?php

declare(strict_types=1);

namespace OCA\OtpManager\Dto\Request\SharedAccount;

use JsonSerializable;

final class SharedAccountDeleteRequestDto implements JsonSerializable
{
    public function __construct(
        public readonly int $accountId,
        public readonly ?int $receiverId
    )
    {
    }

    public function jsonSerialize(): array
    {
        return [
            'accountId' => $this->accountId,
            'receiverId' => $this->receiverId,
        ];
    }
}
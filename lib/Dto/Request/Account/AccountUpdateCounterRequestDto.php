<?php

declare(strict_types=1);

namespace OCA\OtpManager\Dto\Request\Account;

use JsonSerializable;

class AccountUpdateCounterRequestDto implements JsonSerializable
{
    public function __construct(public readonly string $secret)
    {
    }

    public function jsonSerialize(): array
    {
        return [
            'secret' => $this->secret
        ];
    }
}
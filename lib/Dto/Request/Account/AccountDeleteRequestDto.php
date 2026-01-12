<?php

declare(strict_types=1);

namespace OCA\OtpManager\Dto\Request\Account;

use JsonSerializable;

final class AccountDeleteRequestDto implements JsonSerializable
{
    public function __construct(public readonly int $id)
    {
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
        ];
    }
}
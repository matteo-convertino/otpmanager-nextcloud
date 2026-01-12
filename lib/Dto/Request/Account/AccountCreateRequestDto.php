<?php

declare(strict_types=1);

namespace OCA\OtpManager\Dto\Request\Account;

use JsonSerializable;

final class AccountCreateRequestDto extends AccountUpdateRequestDto implements JsonSerializable
{
    public function __construct(
        string               $name,
        ?string              $issuer,
        string               $secret,
        string               $type,
        int                  $period,
        string               $algorithm,
        int                  $digits,

        public readonly ?int $counter,
    )
    {
        parent::__construct(
            name: $name,
            issuer: $issuer,
            secret: $secret,
            type: $type,
            period: $period,
            algorithm: $algorithm,
            digits: $digits,
        );
    }

    public function jsonSerialize(): array
    {
        return parent::jsonSerialize() + ['counter' => $this->counter];
    }
}
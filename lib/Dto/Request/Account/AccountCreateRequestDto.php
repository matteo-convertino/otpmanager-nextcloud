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

    public static function fromArray(array $account): self {
        return new AccountCreateRequestDto(
            name: $account["name"],
            issuer: $account["issuer"],
            secret: $account["secret"],
            type: $account["type"],
            period: $account["period"],
            algorithm: $account["algorithm"],
            digits: $account["digits"],
            counter: array_key_exists("counter", $account) ? $account["counter"] : null,
        );
    }

    public function jsonSerialize(): array
    {
        return parent::jsonSerialize() + ['counter' => $this->counter];
    }
}
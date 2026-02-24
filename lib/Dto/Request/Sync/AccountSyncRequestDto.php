<?php

declare(strict_types=1);

namespace OCA\OtpManager\Dto\Request\Sync;

use JsonSerializable;
use OCA\OtpManager\Dto\Request\Account\AccountCreateRequestDto;

final class AccountSyncRequestDto implements JsonSerializable
{
    public function __construct(
        public readonly int     $id,
        public readonly string  $secret,
        public readonly string  $name,
        public readonly ?string $issuer,
        public readonly string  $algorithm,
        public readonly int     $digits,
        public readonly string  $type,
        public readonly int     $period,
        public readonly ?int    $position,
        public readonly ?int    $counter,
        public readonly string  $icon,
        public readonly bool    $deleted,
        public bool             $toUpdate,
        public readonly bool    $isNew,
    )
    {
    }

    public static function fromArray(array $account): self {
        return new AccountSyncRequestDto(
            id: $account["id"],
            secret: $account["secret"],
            name: $account["name"],
            issuer: $account["issuer"],
            algorithm: $account["algorithm"],
            digits: $account["digits"],
            type: $account["type"],
            period: $account["period"],
            position: $account["position"],
            counter: $account["counter"],
            icon: $account["icon"],
            deleted: $account["deleted"],
            toUpdate: $account["toUpdate"],
            isNew: $account["isNew"],
        );
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'secret' => $this->secret,
            'name' => $this->name,
            'issuer' => $this->issuer,
            'algorithm' => $this->algorithm,
            'digits' => $this->digits,
            'type' => $this->type,
            'period' => $this->period,
            'position' => $this->position,
            'counter' => $this->counter,
            'icon' => $this->icon,
            'deleted' => $this->deleted,
            'toUpdate' => $this->toUpdate,
            'isNew' => $this->isNew,
        ];
    }
}
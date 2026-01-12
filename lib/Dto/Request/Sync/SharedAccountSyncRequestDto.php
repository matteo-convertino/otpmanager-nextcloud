<?php

declare(strict_types=1);

namespace OCA\OtpManager\Dto\Request\Sync;

use JsonSerializable;

final class SharedAccountSyncRequestDto implements JsonSerializable
{
    public function __construct(
        public readonly int     $id,
        public readonly string  $secret,
        public readonly string  $name,
        public readonly ?string $issuer,
        public readonly ?int    $position,
        public readonly string  $icon,
        public readonly bool    $deleted,
        public readonly bool    $toUpdate,
        public readonly int     $accountId,
        public readonly bool    $unlocked,
        public readonly ?string $expiredAt = null,
    )
    {
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'secret' => $this->secret,
            'name' => $this->name,
            'issuer' => $this->issuer,
            'position' => $this->position,
            'icon' => $this->icon,
            'deleted' => $this->deleted,
            'toUpdate' => $this->toUpdate,
            'accountId' => $this->accountId,
            'unlocked' => $this->unlocked,
            'expiredAt' => $this->expiredAt,
        ];
    }
}
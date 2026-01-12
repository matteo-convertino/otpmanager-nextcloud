<?php

declare(strict_types=1);

namespace OCA\OtpManager\Dto\Response;

use JsonSerializable;
use OCA\OtpManager\Db\Account;

class AccountResponseDto implements JsonSerializable
{
    public function __construct(
        public readonly int     $id,
        public readonly string  $secret,
        public readonly string  $name,
        public readonly string  $issuer,
        public readonly int     $digits,
        public readonly string  $type,
        public readonly int     $period,
        public readonly int     $algorithm,
        public readonly ?int    $counter,
        public readonly string  $icon,
        public readonly int     $position,
        public readonly string  $userId,
        public readonly string  $createdAt,
        public readonly string  $updatedAt,
        public readonly ?string $deletedAt,
    )
    {
    }

    /**
     * @param Account $account
     * @return self
     */
    public static function accountToDto(Account $account): self
    {
        return new self(
            id: $account->getId(),
            secret: $account->getSecret(),
            name: $account->getName(),
            issuer: $account->getIssuer(),
            digits: $account->getDigits(),
            type: $account->getType(),
            period: $account->getPeriod(),
            algorithm: $account->getAlgorithm(),
            counter: $account->getCounter(),
            icon: $account->getIcon(),
            position: $account->getPosition(),
            userId: $account->getUserId(),
            createdAt: $account->getCreatedAt(),
            updatedAt: $account->getUpdatedAt(),
            deletedAt: $account->getDeletedAt()
        );
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'secret' => $this->secret,
            'name' => $this->name,
            'issuer' => $this->issuer,
            'digits' => $this->digits,
            'type' => $this->type,
            'period' => $this->period,
            'algorithm' => $this->algorithm,
            'counter' => $this->counter,
            'icon' => $this->icon,
            'position' => $this->position,
            'userId' => $this->userId,
            'createdAt' => $this->createdAt,
            'updatedAt' => $this->updatedAt,
            'deletedAt' => $this->deletedAt,
        ];
    }
}
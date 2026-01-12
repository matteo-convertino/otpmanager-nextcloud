<?php

declare(strict_types=1);

namespace OCA\OtpManager\Dto\Response;

use JsonSerializable;
use OCA\OtpManager\Db\Account;
use OCA\OtpManager\Db\SharedAccount;
use PhpParser\Node\Expr\Cast\Object_;

final class SharedAccountResponseDto implements JsonSerializable
{
    public function __construct(
        public readonly int                  $id,
        public readonly string               $secret,
        public readonly string               $name,
        public readonly string               $issuer,
        public readonly ?int                 $digits = null,
        public readonly ?string              $type = null,
        public readonly ?int                 $period = null,
        public readonly ?int                 $algorithm = null,
        public readonly ?int                 $counter = null,
        public readonly string               $icon,
        public readonly int                  $position,
        public readonly ?string              $userId = null,
        public readonly string               $createdAt,
        public readonly string               $updatedAt,
        public readonly ?string              $deletedAt = null,
        public readonly ?ReceiverResponseDto $receiver = null,
        public readonly ?bool                $unlocked = null,
        public readonly ?string              $expiredAt = null,
    )
    {
    }

    /**
     * @param SharedAccount $sharedAccount
     * @param ReceiverResponseDto $receiver
     * @return self
     */
    public static function sharedAccountEntityToDto(
        SharedAccount       $sharedAccount,
        ReceiverResponseDto $receiver
    ): self
    {
        return new self(
            id: $sharedAccount->getAccountId(),
            secret: $sharedAccount->getSecret(),
            name: $sharedAccount->getName(),
            issuer: $sharedAccount->getIssuer(),
            icon: $sharedAccount->getIcon(),
            position: $sharedAccount->getPosition(),
            createdAt: $sharedAccount->getCreatedAt(),
            updatedAt: $sharedAccount->getUpdatedAt(),
            receiver: $receiver,
            unlocked: $sharedAccount->getUnlocked(),
            expiredAt: $sharedAccount->getExpiredAt(),
        );
    }

    /**
     * @param mixed $sharedAccount
     * @return self
     */
    public static function sharedAccountToDto(mixed $sharedAccount): self
    {
        return new self(
            id: $sharedAccount['account_id'],
            secret: $sharedAccount['secret'],
            name: $sharedAccount['name'],
            issuer: $sharedAccount['issuer'],
            digits: $sharedAccount['digits'],
            type: $sharedAccount['type'],
            period: $sharedAccount['period'],
            algorithm: $sharedAccount['algorithm'],
            counter: $sharedAccount['counter'],
            icon: $sharedAccount['icon'],
            position: $sharedAccount['position'],
            userId: $sharedAccount['user_id'],
            createdAt: $sharedAccount['created_at'],
            updatedAt: $sharedAccount['updated_at'],
            deletedAt: $sharedAccount['deleted_at'],
            receiver: new ReceiverResponseDto(id: $sharedAccount['receiver_id']),
            unlocked: $sharedAccount['unlocked'],
            expiredAt: $sharedAccount['expired_at'],
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
            'receiver' => $this->receiver,
            'unlocked' => $this->unlocked,
            'expiredAt' => $this->expiredAt,
        ];
    }
}
<?php

declare(strict_types=1);

namespace OCA\OtpManager\Dto\Response;

use JsonSerializable;
use OCA\OtpManager\Db\Account;
use OCA\OtpManager\Utils\OtpAlgorithm;
use OCA\OtpManager\Utils\OtpDigit;
use OCA\OtpManager\Utils\OtpPeriod;
use OCA\OtpManager\Utils\OtpType;

final class AccountDatatableResponseDto implements JsonSerializable
{
    public function __construct(
        public readonly int                  $id,
        public readonly string               $secret,
        public readonly string               $name,
        public readonly string               $issuer,
        public readonly OtpDigit             $digits,
        public readonly OtpType              $type,
        public readonly OtpPeriod            $period,
        public readonly OtpAlgorithm         $algorithm,
        public readonly ?int                 $counter,
        public readonly string               $icon,
        public readonly int                  $position,
        public readonly string               $userId,
        public readonly string               $createdAt,
        public readonly string               $updatedAt,
        public readonly bool                 $isShared,
        public readonly ?string              $deletedAt = null,
        public readonly ?ReceiverResponseDto $receiver = null,
        public readonly ?bool                $unlocked = null,
        public readonly ?string              $expiredAt = null,
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
            digits: OtpDigit::tryFrom($account->getDigits()),
            type: OtpType::tryFrom($account->getType()),
            period: OtpPeriod::tryFrom($account->getPeriod()),
            algorithm: OtpAlgorithm::tryFromInt($account->getAlgorithm()),
            counter: $account->getCounter(),
            icon: $account->getIcon(),
            position: $account->getPosition(),
            userId: $account->getUserId(),
            createdAt: $account->getCreatedAt(),
            updatedAt: $account->getUpdatedAt(),
            isShared: false,
            deletedAt: $account->getDeletedAt(),
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
            digits: OtpDigit::tryFrom($sharedAccount['digits']),
            type: OtpType::tryFrom($sharedAccount['type']),
            period: OtpPeriod::tryFrom($sharedAccount['period']),
            algorithm: OtpAlgorithm::tryFromInt($sharedAccount['algorithm']),
            counter: $sharedAccount['counter'],
            icon: $sharedAccount['icon'],
            position: $sharedAccount['position'],
            userId: $sharedAccount['user_id'],
            createdAt: $sharedAccount['created_at'],
            updatedAt: $sharedAccount['updated_at'],
            isShared: true,
            receiver: new ReceiverResponseDto(id: $sharedAccount['receiver_id']),
            unlocked: is_bool($sharedAccount['unlocked']) ? $sharedAccount['unlocked'] : $sharedAccount['unlocked'] === 1,
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
            'isShared' => $this->isShared,
            'deletedAt' => $this->deletedAt,
            'receiver' => $this->receiver,
            'unlocked' => $this->unlocked,
            'expiredAt' => $this->expiredAt,
        ];
    }
}
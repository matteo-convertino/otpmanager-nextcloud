<?php

declare(strict_types=1);

namespace OCA\OtpManager\Dto\Response;

use JsonSerializable;
use OCA\OtpManager\Db\Account;
use OCA\OtpManager\Db\SharedAccount;
use OCA\OtpManager\Utils\OtpAlgorithm;
use OCA\OtpManager\Utils\OtpDigit;
use OCA\OtpManager\Utils\OtpPeriod;
use OCA\OtpManager\Utils\OtpType;
use PhpParser\Node\Expr\Cast\Object_;

final class SharedAccountResponseDto implements JsonSerializable
{
    public function __construct(
        public readonly int                  $id,
        public readonly string               $secret,
        public readonly string               $name,
        public readonly string               $issuer,
        public readonly string               $icon,
        public readonly int                  $position,
        public readonly string               $createdAt,
        public readonly string               $updatedAt,
        public readonly bool                 $unlocked,
        public readonly ?OtpDigit            $digits = null,
        public readonly ?OtpType             $type = null,
        public readonly ?OtpPeriod           $period = null,
        public readonly ?OtpAlgorithm        $algorithm = null,
        public readonly ?int                 $counter = null,
        public readonly ?string              $userId = null,
        public readonly ?string              $deletedAt = null,
        public readonly ?ReceiverResponseDto $receiver = null,
        public readonly ?string              $expiredAt = null,
        public readonly ?string              $password = null,
        public readonly ?string              $iv = null,
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
        ReceiverResponseDto $receiver,
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
            unlocked: $sharedAccount->getUnlocked(),
            receiver: $receiver,
            expiredAt: $sharedAccount->getExpiredAt(),
        );
    }

    /**
     * @param mixed $sharedAccount
     * @param bool $withPassword
     * @return self
     */
    public static function sharedAccountToDto(mixed $sharedAccount, bool $withPassword = false): self
    {
        return new self(
            id: $sharedAccount['account_id'],
            secret: $sharedAccount['secret'],
            name: $sharedAccount['name'],
            issuer: $sharedAccount['issuer'],
            icon: $sharedAccount['icon'],
            position: $sharedAccount['position'],
            createdAt: $sharedAccount['created_at'],
            updatedAt: $sharedAccount['updated_at'],
            unlocked: (bool)$sharedAccount['unlocked'],
            digits: OtpDigit::tryFrom($sharedAccount['digits']),
            type: OtpType::tryFrom($sharedAccount['type']),
            period: OtpPeriod::tryFrom($sharedAccount['period']),
            algorithm: OtpAlgorithm::tryFromInt($sharedAccount['algorithm']),
            counter: $sharedAccount['counter'],
            userId: $sharedAccount['user_id'],
            receiver: new ReceiverResponseDto(id: $sharedAccount['receiver_id']),
            expiredAt: $sharedAccount['expired_at'],
            password: $withPassword ? $sharedAccount['password'] : null,
            iv: $withPassword ? $sharedAccount['iv'] : null,
        );
    }

    public function jsonSerialize(): array
    {
        $data = [
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

        if ($this->password !== null) $data['password'] = $this->password;
        if ($this->iv !== null) $data['iv'] = $this->iv;

        return $data;
    }
}
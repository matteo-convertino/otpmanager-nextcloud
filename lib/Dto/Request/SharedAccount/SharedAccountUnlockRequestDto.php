<?php

declare(strict_types=1);

namespace OCA\OtpManager\Dto\Request\SharedAccount;

use JsonSerializable;
use Symfony\Component\Validator\Constraints as Assert;

class SharedAccountUnlockRequestDto implements JsonSerializable
{
    public function __construct(
        public readonly int  $accountId,

        #[Assert\Length(
            min: 1,
            minMessage: 'currentPassword cannot be empty'
        )]
        public readonly string $currentPassword,

        #[Assert\Length(
            min: 1,
            minMessage: 'tempPassword cannot be empty',
        )]
        public readonly string  $tempPassword,
    )
    {
    }

    public function jsonSerialize(): array
    {
        return [
            'accountId' => $this->accountId,
            'currentPassword' => $this->currentPassword,
            'tempPassword' => $this->tempPassword
        ];
    }
}
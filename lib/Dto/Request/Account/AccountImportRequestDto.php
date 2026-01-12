<?php

declare(strict_types=1);

namespace OCA\OtpManager\Dto\Request\Account;

use JsonSerializable;
use Symfony\Component\Validator\Constraints as Assert;

#[Assert\Expression(
    expression: 'this.iv === null or this.passwordUsedOnExport !== null',
    message: 'Password is required to decrypt accounts'
)]
class AccountImportRequestDto implements JsonSerializable
{
    public function __construct(
        /**
         * @param AccountCreateRequestDto[] $accounts
         */
        #[Assert\Count(min: 1, minMessage: 'At least one account is required.')]
        #[Assert\All([
            new Assert\Type(type: AccountCreateRequestDto::class, message: 'Each item must be a valid account'),
            new Assert\Valid,
        ])]
        public readonly array   $accounts,

        public readonly ?string $iv,
        public readonly ?string $passwordUsedOnExport,
        public readonly string  $currentPassword
    )
    {
    }

    public function jsonSerialize(): array
    {
        return [
            'accounts' => $this->accounts,
            'iv' => $this->iv,
            'passwordUsedOnExport' => $this->passwordUsedOnExport,
            'currentPassword' => $this->currentPassword
        ];
    }
}
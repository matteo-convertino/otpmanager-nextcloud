<?php

declare(strict_types=1);

namespace OCA\OtpManager\Dto\Request\Account;

use JsonSerializable;
use OCA\OtpManager\Attribute\ValidateArrayOfDto;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Context\ExecutionContextInterface;

class AccountImportRequestDto implements JsonSerializable
{
    public function __construct(
        /**
         * @param AccountCreateRequestDto[] $accounts
         */
        #[ValidateArrayOfDto(AccountCreateRequestDto::class)]
        #[Assert\Count(min: 1, minMessage: 'At least one account is required.')]
        public readonly array   $accounts,

        public readonly ?string $iv,
        public readonly ?string $passwordUsedOnExport,
        public readonly string  $currentPassword
    )
    {
    }

    #[Assert\Callback]
    public function passwordViolation(ExecutionContextInterface $context): void
    {
        if ($this->iv !== null && ($this->passwordUsedOnExport === null || $this->passwordUsedOnExport === "")) {
            $context->buildViolation('Password is required to decrypt accounts')
                ->atPath('passwordUsedOnExport')
                ->addViolation();
        }
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
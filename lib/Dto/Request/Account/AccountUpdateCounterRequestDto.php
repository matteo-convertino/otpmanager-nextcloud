<?php

declare(strict_types=1);

namespace OCA\OtpManager\Dto\Request\Account;

use JsonSerializable;
use Symfony\Component\Validator\Context\ExecutionContextInterface;
use Symfony\Component\Validator\Constraints as Assert;

class AccountUpdateCounterRequestDto implements JsonSerializable
{
    public function __construct(public readonly ?int $id, public readonly ?string $secret)
    {
    }

    #[Assert\Callback]
    public function validate(ExecutionContextInterface $context): void
    {
        if ($this->id === null && $this->secret === null) {
            $context->buildViolation('Id and secret cannot both be null')
                ->addViolation();
        } else if ($this->id !== null && $this->secret !== null) {
            $context->buildViolation('Id and secret cannot both be filled')
                ->addViolation();
        }
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'secret' => $this->secret
        ];
    }
}
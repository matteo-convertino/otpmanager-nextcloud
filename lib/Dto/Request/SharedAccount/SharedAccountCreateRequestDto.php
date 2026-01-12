<?php

declare(strict_types=1);

namespace OCA\OtpManager\Dto\Request\SharedAccount;

use JsonSerializable;
use Symfony\Component\Validator\Constraints as Assert;

class SharedAccountCreateRequestDto implements JsonSerializable
{
    public function __construct(
        /**
         * @param string[] $users
         */
        #[Assert\Type('array')]
        #[Assert\Count(min: 1, minMessage: 'You must choose at least one user')]
        #[Assert\All([
            new Assert\Type('string'),
            new Assert\NotBlank(message: 'User cannot be empty'),
        ])]
        public readonly array   $users,

        #[Assert\Length(
            min: 1,
            minMessage: 'accountSecret cannot be empty',
        )]
        public readonly string  $accountSecret,

        #[Assert\Length(
            min: 1,
            minMessage: 'sharedSecret cannot be empty',
        )]
        public readonly string  $sharedSecret,


        #[Assert\Length(
            min: 1,
            minMessage: 'password cannot be empty',
        )]
        public readonly string  $password,

        #[Assert\Length(
            min: 1,
            minMessage: 'iv cannot be empty',
        )]
        public readonly string  $iv,

        #[Assert\Date]
        #[Assert\GreaterThan('today', message: 'expirationDate must be a future date')]
        public readonly ?string $expirationDate,
    )
    {
    }

    public function jsonSerialize(): array
    {
        return [
            'users' => $this->users,
            'accountSecret' => $this->accountSecret,
            'sharedSecret' => $this->sharedSecret,
            'password' => $this->password,
            'iv' => $this->iv,
            'expirationDate' => $this->expirationDate,
        ];
    }
}
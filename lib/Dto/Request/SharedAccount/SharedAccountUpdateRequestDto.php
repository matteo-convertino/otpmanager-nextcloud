<?php

declare(strict_types=1);

namespace OCA\OtpManager\Dto\Request\SharedAccount;

use JsonSerializable;
use Symfony\Component\Validator\Constraints as Assert;

class SharedAccountUpdateRequestDto implements JsonSerializable
{
    public function __construct(

        #[Assert\Length(
            min: 1,
            max: 256,
            minMessage: 'name cannot be empty',
            maxMessage: 'name must be shorter than 256 characters'
        )]
        public readonly string  $name,

        #[Assert\Length(
            max: 256,
            maxMessage: 'issuer must be shorter than 256 characters'
        )]
        public readonly ?string $issuer,

        #[Assert\Length(
            min: 1,
            minMessage: 'secret cannot be empty',
        )]
        public readonly string  $secret,
    )
    {
    }

    public function jsonSerialize(): array
    {
        return [
            'name' => $this->name,
            'issuer' => $this->issuer,
            'secret' => $this->secret
        ];
    }
}
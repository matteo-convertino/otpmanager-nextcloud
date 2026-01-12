<?php

declare(strict_types=1);

namespace OCA\OtpManager\Dto\Request\Account;

use JsonSerializable;
use OCA\OtpManager\Utils\OtpAlgorithm;
use OCA\OtpManager\Utils\OtpDigit;
use OCA\OtpManager\Utils\OtpPeriod;
use OCA\OtpManager\Utils\OtpType;
use Symfony\Component\Validator\Constraints as Assert;

class AccountUpdateRequestDto implements JsonSerializable
{
    public function __construct(
//        #[Assert\NotBlank(message: 'Name must be 1-256 characters long')]
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
            min: 16,
            max: 512,
            minMessage: 'secret must be 16-512 characters long',
            maxMessage: 'secret must be 16-512 characters long'
        )]
        public string           $secret,

        #[Assert\Choice(
            callback: [OtpType::class, 'values'],
            message: 'type must be one of those listed'
        )]
        public readonly string  $type,

        #[Assert\Choice(
            callback: [OtpPeriod::class, 'values'],
            message: 'period must be one of those listed'
        )]
        public readonly int     $period,

        #[Assert\Choice(
            callback: [OtpAlgorithm::class, 'values'],
            message: 'algorithm must be one of those listed'
        )]
        public readonly string  $algorithm,

        #[Assert\Choice(
            callback: [OtpDigit::class, 'values'],
            message: 'digits must be one of those listed'
        )]
        public readonly int     $digits,
    )
    {
    }

    public function jsonSerialize(): array
    {
        return [
            'name' => $this->name,
            'issuer' => $this->issuer,
            'secret' => $this->secret,
            'type' => $this->type,
            'period' => $this->period,
            'algorithm' => $this->algorithm,
            'digits' => $this->digits,
        ];
    }
}
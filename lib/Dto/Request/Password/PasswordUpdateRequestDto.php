<?php

declare(strict_types=1);

namespace OCA\OtpManager\Dto\Request\Password;

use JsonSerializable;
use Symfony\Component\Validator\Constraints as Assert;

final class PasswordUpdateRequestDto implements JsonSerializable
{
    public function __construct(
        public readonly string $oldPassword,
        #[Assert\Length(
            min: 6,
            minMessage: 'Password must be at least 6 characters long.'
        )]
        #[Assert\Regex(
            pattern: '/[a-z]/',
            message: 'Password must contain at least one lowercase letter.'
        )]
        #[Assert\Regex(
            pattern: '/[A-Z]/',
            message: 'Password must contain at least one uppercase letter.'
        )]
        #[Assert\Regex(
            pattern: '/[0-9]/',
            message: 'Password must contain at least one number.'
        )]
        #[Assert\Regex(
            pattern: '/[[:punct:]]/',
            message: 'Password must contain at least one special character.'
        )]
        public readonly string $newPassword
    )
    {
    }

    public function jsonSerialize(): array
    {
        return [
            'oldPassword' => $this->oldPassword,
            'newPassword' => $this->newPassword,
        ];
    }
}

<?php

declare(strict_types=1);

namespace OCA\OtpManager\Dto\Request;

use JsonSerializable;
use Symfony\Component\Validator\Constraints as Assert;

final class PasswordCheckRequestDto implements JsonSerializable
{
    public function __construct(public readonly string $password)
    {
    }

    public function jsonSerialize(): array
    {
        return [
            'password' => $this->password,
        ];
    }
}
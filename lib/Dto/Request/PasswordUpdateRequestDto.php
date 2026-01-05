<?php

declare(strict_types=1);

namespace OCA\OtpManager\Dto\Request;

use JsonSerializable;

final class PasswordUpdateRequestDto implements JsonSerializable
{
    public function __construct(
        public readonly string $oldPassword,
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
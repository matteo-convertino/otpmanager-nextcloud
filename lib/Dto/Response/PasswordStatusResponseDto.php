<?php

declare(strict_types=1);

namespace OCA\OtpManager\Dto\Response;

use JsonSerializable;

final class PasswordStatusResponseDto implements JsonSerializable
{
    public function __construct(
        public readonly bool $hasPassword
    )
    {
    }

    public function jsonSerialize(): array
    {
        return [
            'hasPassword' => $this->hasPassword,
        ];
    }
}
<?php

declare(strict_types=1);

namespace OCA\OtpManager\Dto\Response;

use JsonSerializable;

final class PasswordResponseDto implements JsonSerializable
{
    public function __construct(public readonly string $iv)
    {
    }

    public function jsonSerialize(): array
    {
        return [
            'iv' => $this->iv,
        ];
    }
}
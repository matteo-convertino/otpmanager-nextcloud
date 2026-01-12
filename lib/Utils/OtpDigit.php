<?php

namespace OCA\OtpManager\Utils;

enum OtpDigit: int
{
    case D4 = 4;
    case D6 = 6;

    public static function values(): array
    {
        return array_map(fn ($case) => $case->value, self::cases());
    }
}
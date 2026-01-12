<?php

namespace OCA\OtpManager\Utils;

enum OtpType: string
{
    case TOTP = 'totp';
    case HOTP = 'hotp';

    public static function values(): array
    {
        return array_map(fn ($case) => $case->value, self::cases());
    }
}
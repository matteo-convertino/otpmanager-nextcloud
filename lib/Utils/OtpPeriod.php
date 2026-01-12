<?php

namespace OCA\OtpManager\Utils;

enum OtpPeriod: int
{
    case P30 = 30;
    case P45 = 45;
    case P60 = 60;

    public static function values(): array
    {
        return array_map(fn ($case) => $case->value, self::cases());
    }
}
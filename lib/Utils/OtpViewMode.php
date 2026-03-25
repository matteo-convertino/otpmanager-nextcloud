<?php

namespace OCA\OtpManager\Utils;

enum OtpViewMode: string
{
    case GRID = 'grid';
    case TABLE = 'table';

    public static function values(): array
    {
        return array_map(fn ($case) => $case->value, self::cases());
    }
}
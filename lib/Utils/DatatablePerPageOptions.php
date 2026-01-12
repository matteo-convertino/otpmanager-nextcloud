<?php

namespace OCA\OtpManager\Utils;

enum DatatablePerPageOptions: string
{
    case PER_PAGE_10 = '10';
    case PER_PAGE_20 = '20';
    case PER_PAGE_30 = '30';
    case PER_PAGE_ALL = 'All';

    public static function values(): array
    {
        return array_map(fn ($case) => $case->value, self::cases());
    }
}
<?php

namespace OCA\OtpManager\Utils;

use OCP\AppFramework\OCS\OCSBadRequestException;

enum OtpAlgorithm: string
{
    case SHA1 = 'SHA1';
    case SHA256 = 'SHA256';
    case SHA512 = 'SHA512';

    public static function values(): array
    {
        return array_map(fn ($case) => $case->value, self::cases());
    }

    /**
     * @param string $algorithm
     * @return int
     * @throws OCSBadRequestException
     */
    public static function convertToInt(string $algorithm): int
    {
        $case = self::tryFrom($algorithm);

        if ($case === null) {
            throw new OCSBadRequestException("Algorithm is not valid: $algorithm");
        }

        return array_search($case, self::cases(), true);
    }
}
<?php

declare(strict_types=1);

namespace OCA\OtpManager\Controller\Validator;

class AccountForm
{
    public static function validate(string $name, string $issuer, string | null $secret, string $type, string $period, string $algorithm, string $digits): array
    {
        $errors = [];

        if (strlen($name) == 0 || strlen($name) > 256)
            $errors["name"] = "Name must be 1-256 characters long";

        if (strlen($issuer) > 256)
            $errors["issuer"] = "Issuer must be shorter than 256 characters";

        if (!in_array($type, ["totp", "hotp"]))
            $errors["type"] = "Type of code must be one of those listed";

        if (!in_array($period, ["30", "45", "60"]))
            $errors["period"] = "Interval must be one of those listed";

        if (!in_array($algorithm, ["SHA1", "SHA256", "SHA512", "0", "1", "2"]))
            $errors["algorithm"] = "Algorithm must be one of those listed";

        if (!in_array($digits, ["4", "6"]))
            $errors["digits"] = "Digits must be one of those listed";

        if (!is_null($secret) && (strlen($secret) < 16 || strlen($secret) > 512))
            $errors["secret"] = "Secret key must be 16-512 characters long";

        return $errors;
    }
}

<?php

declare(strict_types=1);

namespace OCA\OtpManager\Controller\Validator;

class SharedAccountForm
{
    public static function validateCreate(string $accountSecret, array $users, string $sharedSecret, string $password, string $iv, string | null $expirationDate): array
    {
        $errors = [];

        if (strlen($accountSecret) == 0)
            $errors["error"] = "accountSecret cannot be empty";

        if (strlen($sharedSecret) == 0)
            $errors["error"] = "sharedSecret cannot be empty";

        if (strlen($iv) == 0)
            $errors["error"] = "IV cannot be empty";

        if (count($users) == 0)
            $errors["users"] = "You must choose at least one user";

        if (!is_null($expirationDate) && date('Y-m-d') > date('Y-m-d', strtotime($expirationDate)))
            $errors["expirationDate"] = "Expiration Date must be a future date";

        if (strlen($password) == 0)
            $errors["password"] = "Password cannot be empty";

        return $errors;
    }

    public static function validateUpdate(string $name, string $issuer, string $secret): array
    {
        $errors = [];

        if (strlen($secret) == 0)
            $errors["error"] = "Secret cannot be empty";

        if (strlen($name) == 0 || strlen($name) > 256)
            $errors["name"] = "Name must be 1-256 characters long";

        if (strlen($issuer) > 256)
            $errors["issuer"] = "Issuer must be shorter than 256 characters";

        return $errors;
    }
}

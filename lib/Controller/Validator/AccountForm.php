<?php

declare(strict_types=1);
// SPDX-FileCopyrightText: Matteo Convertino <matteo@convertino.cloud>
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace OCA\OtpManager\Controller\Validator;

class AccountForm
{
    public static function validate($data)
	{
		$errors = [];

		if (!array_key_exists("name", $data) || strlen($data["name"]) == 0 || strlen($data["name"]) > 256)
			$errors["name"] = "Name must be 1-256 characters long";

		if (!array_key_exists("issuer", $data) || strlen($data["issuer"]) > 256)
			$errors["issuer"] = "Issuer must be shorter than 256 characters";

		if (!array_key_exists("type", $data) || !in_array($data["type"], ["totp", "hotp"]))
			$errors["type"] = "Type of code must be one of those listed";

		if (!array_key_exists("period", $data) || !in_array($data["period"], ["30", "45", "60"]))
			$errors["period"] = "Interval must be one of those listed";

		if (!array_key_exists("algorithm", $data) || !in_array($data["algorithm"], ["SHA1", "SHA256", "SHA512", "0", "1", "2"]))
			$errors["algorithm"] = "Algorithm must be one of those listed";

		if (!array_key_exists("digits", $data) || !in_array($data["digits"], ["4", "6"]))
			$errors["digits"] = "Digits must be one of those listed";

		if (!array_key_exists("secret", $data) || strlen($data["secret"]) < 16 || strlen($data["secret"]) > 512)
			$errors["secret"] = "Secret key must be 16-512 characters long";

		return $errors;
	}
}
<?php

declare(strict_types=1);
// SPDX-FileCopyrightText: Matteo Convertino <matteo@convertino.cloud>
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace OCA\OtpManager\Controller\Validator;

class SharedAccountForm
{
    public static function validateCreate($data)
	{
		$errors = [];
		
		if (!array_key_exists("accountSecret", $data))
			$errors["error"] = "You must select which account to share";

		if (!array_key_exists("sharedSecret", $data) || strlen($data["sharedSecret"]) == 0)
			$errors["error"] = "Secret cannot be empty";

		if (!array_key_exists("iv", $data) || strlen($data["iv"]) == 0)
			$errors["error"] = "IV cannot be empty";

		if (!array_key_exists("users", $data) || !is_array($data["users"]) || count($data["users"]) == 0)
			$errors["users"] = "You must choose at least one user";

		if (array_key_exists("expirationDate", $data) && !is_null($data["expirationDate"]) && date('Y-m-d') > date('Y-m-d', strtotime($data["expirationDate"])))
			$errors["expirationDate"] = "Expiration Date must be a future date";

		if (!array_key_exists("password", $data) || strlen($data["password"]) == 0)
			$errors["password"] = "Password cannot be empty";

		return $errors;
	}

	public static function validateUpdate($data)
	{
		$errors = [];

		if (!array_key_exists("name", $data) || strlen($data["name"]) == 0 || strlen($data["name"]) > 256)
			$errors["name"] = "Name must be 1-256 characters long";

		if (!array_key_exists("issuer", $data) || strlen($data["issuer"]) > 256)
			$errors["issuer"] = "Issuer must be shorter than 256 characters";

		return $errors;
	}
}
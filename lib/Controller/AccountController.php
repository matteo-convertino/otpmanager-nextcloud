<?php

declare(strict_types=1);
// SPDX-FileCopyrightText: Matteo Convertino <matteo@convertino.cloud>
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace OCA\OtpManager\Controller;

use OCA\OtpManager\Db\Account;
use OCA\OtpManager\Db\AccountMapper;
use OCA\OtpManager\Db\SharedAccountMapper;
use OCA\OtpManager\Utils\Encryption;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\JSONResponse;
use OCP\IRequest;
use OCA\OtpManager\Controller\Validator\AccountForm;

class AccountController extends Controller
{

	private AccountMapper $accountMapper;
	private SharedAccountMapper $sharedAccountMapper;
	private Encryption $encryption;
	private ?string $userId;

	public function __construct(
		string $AppName,
		IRequest $request,
		AccountMapper $accountMapper,
		SharedAccountMapper $sharedAccountMapper,
		Encryption $encryption,
		?string $UserId = null
	) {
		parent::__construct($AppName, $request);
		$this->accountMapper = $accountMapper;
		$this->sharedAccountMapper = $sharedAccountMapper;
		$this->encryption = $encryption;
		$this->userId = $UserId;
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function get($id)
	{
		return $this->accountMapper->find("id", $id, $this->userId);
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function getAll()
	{
		$accounts = $this->accountMapper->findAllByUser($this->userId);
		$sharedAccounts = $this->sharedAccountMapper->findAllByReceiver($this->userId);

		$data = [
			"accounts" => $accounts,
			"shared_accounts" => $sharedAccounts,
		];

		return $data;
	}

	private function convertAlgorithmToInt($algorithm)
	{
		if ($algorithm == "SHA1") {
			return 0;
		} else if ($algorithm == "SHA256") {
			return 1;
		} else if ($algorithm == "SHA512") {
			return 2;
		}

		return $algorithm;
	}

	/**
	 * @NoAdminRequired
	 */
	public function create($data)
	{	
		$errors = AccountForm::validate($data);

		if (count($errors) > 0) {
			return $errors;
		} else {
			$data["algorithm"] = $this->convertAlgorithmToInt($data["algorithm"]);

			$account = $this->accountMapper->find("secret", $data["secret"], $this->userId);

			if ($account != null && $account->getDeletedAt() == null) {
				$errors["secret"] = "This secret key already exists";
				return $errors;
			}

			$maxSharedAccountPos = $this->sharedAccountMapper->findMaxPosition($this->userId);
			$maxAccountPos = $this->accountMapper->findMaxPosition($this->userId);

			$position = max($maxSharedAccountPos, $maxAccountPos) + 1;

			if ($account == null) {
				$account = new Account();
				
				$account->setSecret($data["secret"]);
				$account->setName($data["name"]);
				$account->setIssuer($data["issuer"]);
				$account->setDigits($data["digits"]);
				$account->setType($data["type"]);
				$account->setPeriod($data["period"]);
				$account->setAlgorithm($data["algorithm"]);
				$account->setCounter($data["type"] == "totp" ? null : 0);
				$account->setPosition($position);
				$account->setUserId($this->userId);
				$account->setCreatedAt(date("Y-m-d H:i:s"));
				$account->setUpdatedAt(date("Y-m-d H:i:s"));

				$this->accountMapper->insert($account);
			} else {
				$account->setName($data["name"]);
				$account->setIssuer($data["issuer"]);
				$account->setDigits($data["digits"]);
				$account->setType($data["type"]);
				$account->setPeriod($data["period"]);
				$account->setAlgorithm($data["algorithm"]);
				$account->setCounter($data["counter"]);
				$account->setPosition($position);
				$account->setDeletedAt(null);
				$account->setUpdatedAt(date("Y-m-d H:i:s"));

				$this->accountMapper->update($account);
			}

			return "OK";
		}
	}

	/**
	 * @NoAdminRequired
	 */
	public function update($data)
	{
		$errors = AccountForm::validate($data);

		if (count($errors) > 0) {
			return $errors;
		} else {
			$data["algorithm"] = $this->convertAlgorithmToInt($data["algorithm"]);

			$account = $this->accountMapper->find("secret", $data["secret"], $this->userId);

			if ($account == null) {
				$errors["msg"] = "This account does not exists";
				return $errors;
			} else if ($account->getDeletedAt() != null) {
				$errors["msg"] = "This account has been deleted";
				return $errors;
			}

			$account->setName($data["name"]);
			$account->setIssuer($data["issuer"]);
			$account->setDigits($data["digits"]);
			$account->setType($data["type"]);
			$account->setPeriod($data["period"]);
			$account->setAlgorithm($data["algorithm"]);
			//if (isset($data["counter"])) $account->setCounter($data["counter"]);
			$account->setUpdatedAt(date("Y-m-d H:i:s"));

			$this->accountMapper->update($account);

			return "OK";
		}
	}

	/**
	 * @NoAdminRequired
	 */
	public function delete(int $id)
	{
		$account = $this->accountMapper->find("id", $id, $this->userId);

		if($account == null) return new JSONResponse(["error" => "There was an error while deleting your account"], 500);

		// delete shares
		$this->sharedAccountMapper->destroy($account);

		$this->accountMapper->safeDelete($account); 
	}

	/**
	 * @NoAdminRequired
	 */
	/*public function destroy($id)
	{
		return $this->accountMapper->destroy($id, $this->userId);
	}*/
	
	/**
	 * @NoAdminRequired
	 */
	public function import(array $data, string | null $passwordUsedOnExport, string $currentPassword)
	{
		if (!array_key_exists("accounts", $data)) return new JSONResponse(["error" => "Invalid JSON file"], 400);
		if (array_key_exists("iv", $data) && empty($passwordUsedOnExport)) return new JSONResponse(["error" => "Password is required to decrypt accounts"], 400);

		foreach ($data["accounts"] as $importedAccount) {
			if (array_key_exists("iv", $data)) {
				$importedAccount["secret"] = $this->encryption->decrypt($importedAccount["secret"], $passwordUsedOnExport, $data["iv"]);
				if ($importedAccount["secret"] === false) return new JSONResponse(["error" => "Password incorrect"], 400);
			}

			$importedAccount["secret"] = strtoupper($importedAccount["secret"]);
			$importedAccount["secret"] = $this->encryption->encrypt($importedAccount["secret"], $currentPassword, $this->userId, true);
			if ($importedAccount === false) return new JsonResponse([], 403);

			$this->create($importedAccount);
		}

		return new JSONResponse();
	}

	/**
	 * @NoAdminRequired
	 */
	public function updateCounter(string $secret)
	{
		$account = $this->accountMapper->find("secret", $secret, $this->userId);

		if($account == null) return new JSONResponse(["error" => "This account does not exists"], 400);
		if($account->getType() == "totp")  return new JSONResponse(["error" => "You cannot update counter of a TOTP account"], 400);

		$account->setCounter($account->getCounter() + 1);
		$this->accountMapper->update($account);

		return $account->getCounter();
	}
}

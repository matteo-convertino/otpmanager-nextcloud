<?php

declare(strict_types=1);
// SPDX-FileCopyrightText: Matteo Convertino <matteo@convertino.cloud>
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace OCA\OtpManager\Controller;

use OCA\OtpManager\Db\Account;
use OCA\OtpManager\Db\AccountMapper;
use OCA\OtpManager\Utils\Encryption;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\JSONResponse;
use OCP\IRequest;

class AccountController extends Controller
{

	private AccountMapper $accountMapper;
	private Encryption $encryption;
	private ?string $userId;

	public function __construct(
		string $AppName,
		IRequest $request,
		AccountMapper $accountMapper,
		Encryption $encryption,
		?string $UserId = null
	) {
		parent::__construct($AppName, $request);
		$this->accountMapper = $accountMapper;
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
		$data = ["accounts" => $accounts];

		return $data;
	}

	private function validateFields($data)
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
		$errors = $this->validateFields($data);

		if (count($errors) > 0) {
			return $errors;
		} else {
			$data["algorithm"] = $this->convertAlgorithmToInt($data["algorithm"]);

			$account = $this->accountMapper->find("secret", $data["secret"], $this->userId);

			if ($account != null && $account->getDeletedAt() == null) {
				$errors["secret"] = "This secret key already exists";
				return $errors;
			}

			$position = 0;
			$accountsSortedByPos = $this->accountMapper->findAllByUser($this->userId);

			if (count($accountsSortedByPos) > 0) {
				$position = $accountsSortedByPos[0]->getPosition() + 1;
			}

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
		$errors = $this->validateFields($data);

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
			if (isset($data["counter"])) $account->setCounter($data["counter"]);
			$account->setUpdatedAt(date("Y-m-d H:i:s"));

			$this->accountMapper->update($account);

			return "OK";
		}
	}

	/**
	 * @NoAdminRequired
	 */
	public function delete($id)
	{
		$account = $this->accountMapper->find("id", $id, $this->userId);

		if ($account == null) {
			return null;
		} else {
			// decrease by 1 the position of all accounts after it
			$accountsGreaterPos = $this->accountMapper->findAllAccountsPosGtThan($account->getPosition(), $this->userId);

			foreach ($accountsGreaterPos as $accountGreaterPos) {
				$accountGreaterPos->setPosition($accountGreaterPos->getPosition() - 1);
				$this->accountMapper->update($accountGreaterPos);
			}

			$account->setDeletedAt(date("Y-m-d H:i:s"));
			$account->setPosition(null);
			$this->accountMapper->update($account);

			return "OK";
		}
	}

	/**
	 * @NoAdminRequired
	 */
	/*public function destroy($id)
	{
		return $this->accountMapper->destroy($id, $this->userId);
	}*/
	
	private function adjustPosition(int $pos)
	{
		$accountPosition = $pos;

		// increments by 1 the position of all those accounts
		// that are on and above (>=) the position of where I want to add the new account
		$accountsGtePos = $this->accountMapper->findAllAccountsPosGteThan($pos, $this->userId);

		foreach ($accountsGtePos as $accountGtePos) {
			$accountGtePos->setPosition(++$pos);
			$this->accountMapper->update($accountGtePos);
		}

		// decreases the position of the new account 
		// if it is distant from the other accounts (if his position is > the last position)
		$accountsSortedByPos = $this->accountMapper->findAllByUser($this->userId);

		if (count($accountsSortedByPos) > 0) {
			$lastPosition = $accountsSortedByPos[0]->getPosition();
			if ($accountPosition > $lastPosition - 1) {
				return $lastPosition + 1;
			}
		}
		return $accountPosition;
	}

	/**
	 * To compare local accounts with server accounts it runs two steps:
	 *     - loop local accounts by searching in DB
	 *     - loop server accounts by searching through local accounts
	 */
	private function compareAccounts(array $localAccounts)
	{
		$ris = ["toAdd" => [], "toDelete" => [], "toEdit" => []];

		// local accounts | server accounts
		// check if there are accounts that have to be:
		//	  - added on server: "isNew" => true && it is not in DB
		//	  - recovered from trash: "isNew" => true && there is in DB and "deleted_at" != null
		//    - deleted on local: local account is not in DB || there is in DB and "deleted_at" != null
		//	  - deleted on server: "deleted" => true
		//    - edited on server: "toUpdate" => true && it is not deleted on DB
		foreach ($localAccounts as $localAccount) {
			$serverAccount = $this->accountMapper->find("secret", $localAccount["secret"], $this->userId);

			if ($localAccount["deleted"]) {
				if($serverAccount != null) {
					$serverAccount->setPosition(null);
					$serverAccount->setDeletedAt(date("Y-m-d H:i:s"));
					$this->accountMapper->update($serverAccount);
				}
			} else if ($localAccount["isNew"]) {
				$position = $this->adjustPosition($localAccount["position"]);

				if ($serverAccount != null) {
					if ($serverAccount->getDeletedAt() != null) {
						$serverAccount->setName($localAccount["name"]);
						$serverAccount->setIssuer($localAccount["issuer"]);
						$serverAccount->setDigits($localAccount["digits"]);
						$serverAccount->setType($localAccount["type"]);
						$serverAccount->setPeriod($localAccount["period"]);
						$serverAccount->setAlgorithm($localAccount["algorithm"]);
						$serverAccount->setCounter($localAccount["counter"]);
						$serverAccount->setIcon($localAccount["icon"] ?? "default");
						$serverAccount->setPosition($position);
						$serverAccount->setDeletedAt(null);
						$serverAccount->setUpdatedAt(date("Y-m-d H:i:s"));
						$this->accountMapper->update($serverAccount);
					} else {
						// same account has been added by other device and you didn't refreshed
						$localAccount["toUpdate"] = true;
					}
				} else {
					$account = new Account();

					$account->setSecret($localAccount["secret"]);
					$account->setName($localAccount["name"]);
					$account->setIssuer($localAccount["issuer"]);
					$account->setDigits($localAccount["digits"]);
					$account->setType($localAccount["type"]);
					$account->setPeriod($localAccount["period"]);
					$account->setAlgorithm($localAccount["algorithm"]);
					$account->setCounter($localAccount["counter"]);
					$account->setIcon($localAccount["icon"] ?? "default");
					$account->setPosition($position);
					$account->setUserId($this->userId);
					$account->setCreatedAt(date("Y-m-d H:i:s"));
					$account->setUpdatedAt(date("Y-m-d H:i:s"));

					$this->accountMapper->insert($account);
				}
			} else if ($serverAccount == null || $serverAccount->getDeletedAt() != null) {
				array_push($ris["toDelete"], $localAccount["id"]);
			}

			if ($localAccount["toUpdate"] && $serverAccount->getDeletedAt() == null) {
				$account = $serverAccount;

				$account->setSecret($localAccount["secret"]);
				$account->setName($localAccount["name"]);
				$account->setIssuer($localAccount["issuer"]);
				$account->setDigits($localAccount["digits"]);
				$account->setType($localAccount["type"]);
				$account->setPeriod($localAccount["period"]);
				$account->setAlgorithm($localAccount["algorithm"]);
				$account->setCounter($localAccount["counter"]);
				$account->setIcon($localAccount["icon"] ?? "default");
				$account->setPosition($localAccount["position"]);
				$account->setUpdatedAt(date("Y-m-d H:i:s"));

				$this->accountMapper->update($account);
			}
		}

		// server accounts | local accounts
		// check if there are accounts that have to be:
		//	  - added on local: it is not in local side
		//    - edited on local: it is in local side && some fields have been edited (ex: another device have edited the name of google account)
		foreach ($this->accountMapper->findAllByUser($this->userId) as $serverAccount) {
			$found = false;
			$toEdit = false;

			foreach ($localAccounts as $localAccount) {
				if ($serverAccount->getSecret() == $localAccount["secret"]) {

					if ($serverAccount->getName() != $localAccount["name"]) $toEdit = true;
					else if ($serverAccount->getIssuer() != $localAccount["issuer"]) $toEdit = true;
					else if ($serverAccount->getDigits() != $localAccount["digits"]) $toEdit = true;
					else if ($serverAccount->getType() != $localAccount["type"]) $toEdit = true;
					else if ($serverAccount->getPeriod() != $localAccount["period"]) $toEdit = true;
					else if ($serverAccount->getAlgorithm() != $localAccount["algorithm"]) $toEdit = true;
					else if ($serverAccount->getCounter() != $localAccount["counter"]) $toEdit = true;
					else if ($serverAccount->getIcon() != ($localAccount["icon"] ?? "default")) $toEdit = true;
					else if ($serverAccount->getPosition() != $localAccount["position"]) $toEdit = true;

					$found = true;
					break;
				}
			}

			if (!$found) {
				array_push($ris["toAdd"], $serverAccount);
			} else {
				if ($toEdit) array_push($ris["toEdit"], $serverAccount);
			}
		}

		return $ris;
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function sync(array $accounts)
	{
		return $this->compareAccounts($accounts);
	}

	/**
	 * @NoAdminRequired
	 */
	public function import(array $data, string | null $passwordUsedOnExport, string $currentPassword)
	{
		if (!array_key_exists("accounts", $data)) return new JSONResponse(["error" => "Invalid JSON file"], 400);
		if (array_key_exists("iv", $data) && empty($passwordUsedOnExport)) return new JSONResponse(["error" => "Password is required to decrypt accounts"], 400);

		foreach ($data["accounts"] as $importedAccount) {
			if (array_key_exists("iv", $data)) {
				$importedAccount["secret"] = $this->encryption->decryptImported($importedAccount["secret"], $passwordUsedOnExport, $data["iv"]);
				if ($importedAccount["secret"] === false) return new JSONResponse(["error" => "Password incorrect"], 400);
			}

			$importedAccount["secret"] = strtoupper($importedAccount["secret"]);
			$importedAccount["secret"] = $this->encryption->encrypt($importedAccount["secret"], $currentPassword, $this->userId);
			if ($importedAccount === false) return new JsonResponse([], 403);

			$this->create($importedAccount);
		}

		return new JSONResponse();
	}
}

<?php

declare(strict_types=1);
// SPDX-FileCopyrightText: Matteo Convertino <matteo@convertino.cloud>
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace OCA\OtpManager\Controller;

use OCA\OtpManager\Db\Account;
use OCA\OtpManager\Db\AccountMapper;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\JSONResponse;
use OCP\IRequest;

class SyncController extends Controller
{
    private AccountMapper $accountMapper;
	private ?string $userId;

	public function __construct(
		string $AppName,
		IRequest $request,
		AccountMapper $accountMapper,
		?string $UserId = null
	) {
		parent::__construct($AppName, $request);
		$this->accountMapper = $accountMapper;
		$this->userId = $UserId;
	}


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
	public function sync(array $data)
	{
		if (!array_key_exists("appVersion", $data)) return new JSONResponse(["error" => "Please update mobile app to the latest version"], 400);
		if (!array_key_exists("accounts", $data)) return new JSONResponse(["error" => "Accounts are missing"], 400);
		
		$appVersion = explode(".", $data["appVersion"]);

		$major = $appVersion[0];
		$minor = $appVersion[1];
		$patch = $appVersion[2];

		if($major == 1 && $minor >= 5) {
			return $this->compareAccounts($data["accounts"]);
		} else {
			return new JSONResponse(["error" => "Please update mobile app to the latest version"], 400);
		}
	}

}
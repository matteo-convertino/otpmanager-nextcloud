<?php

declare(strict_types=1);

namespace OCA\OtpManager\Utils;

use OCA\OtpManager\Db\SharedAccountMapper;

class SyncSharedAccount
{

	private SharedAccountMapper $sharedAccountMapper;
	private string $userId;

	public function __construct(SharedAccountMapper $sharedAccountMapper, string $userId)
	{
		$this->sharedAccountMapper = $sharedAccountMapper;
		$this->userId = $userId;
	}

	/**
	 * To compare local accounts with server accounts it runs two steps:
	 *     - loop local accounts by searching in DB
	 *     - loop server accounts by searching through local accounts
	 */
	public function sync(array $localAccounts)
	{
		$ris = ["toAdd" => [], "toDelete" => [], "toEdit" => []];

		// local accounts | server accounts
		// check if there are accounts that have to be:
		//    - deleted on local: local account is not in DB
		//	  - deleted on server: "deleted" => true
		//    - edited on server: "toUpdate" => true
		foreach ($localAccounts as $localAccount) {
			$serverAccount = $this->sharedAccountMapper->find("account_id", $localAccount["accountId"], $this->userId);

			if ($serverAccount == null) {
				array_push($ris["toDelete"], $localAccount["id"]);
			} else if ($localAccount["deleted"]) {
				$this->sharedAccountMapper->delete($serverAccount);
			} else if ($localAccount["toUpdate"]) {
				$sharedAccount = $serverAccount;

				$sharedAccount->setName($localAccount["name"]);
				$sharedAccount->setIssuer($localAccount["issuer"]);
				$sharedAccount->setUnlocked($localAccount["unlocked"]);
				$sharedAccount->setIcon($localAccount["icon"] ?? "default");
				$sharedAccount->setPosition($localAccount["position"]);
				$sharedAccount->setUpdatedAt(date("Y-m-d H:i:s"));

				$this->sharedAccountMapper->update($sharedAccount);
			}
		}

		// server accounts | local accounts
		// check if there are accounts that have to be:
		//	  - added on local: it is not in local side
		//    - edited on local: it is in local side && some fields have been edited (ex: another device have edited the name of google account)
		foreach ($this->sharedAccountMapper->findAllByReceiverJoin($this->userId) as $serverAccount) {
			$found = false;
			$toEdit = false;

			foreach ($localAccounts as $localAccount) {
				if ($serverAccount["account_id"] == $localAccount["accountId"]) {

					if ($serverAccount["secret"] != $localAccount["secret"]) $toEdit = true;
					else if ($serverAccount["name"] != $localAccount["name"]) $toEdit = true;
					else if ($serverAccount["issuer"] != $localAccount["issuer"]) $toEdit = true;
					else if ($serverAccount["unlocked"] != $localAccount["unlocked"]) $toEdit = true;
					else if ($serverAccount["icon"] != ($localAccount["icon"] ?? "default")) $toEdit = true;
					else if ($serverAccount["position"] != $localAccount["position"]) $toEdit = true;
					else if ($serverAccount["expired_at"] != $localAccount["expiredAt"]) $toEdit = true;

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
}

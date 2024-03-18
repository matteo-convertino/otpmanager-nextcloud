<?php

declare(strict_types=1);
// SPDX-FileCopyrightText: Matteo Convertino <matteo@convertino.cloud>
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace OCA\OtpManager\Controller;

use OCA\OtpManager\Db\SharedAccount;
use OCA\OtpManager\Db\SharedAccountMapper;
use OCA\OtpManager\Db\AccountMapper;
use OCA\OtpManager\Utils\Encryption;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\JSONResponse;
use OCA\OtpManager\Controller\Validator\SharedAccountForm;

use OCP\IRequest;
use OCP\IUserManager;
use \OCP\ILogger;
use OCP\UserInterface;
use OCP\IAvatarManager;

class SharedAccountController extends Controller
{
	private IUserManager $userManager;
	private SharedAccountMapper $sharedAccountMapper;
	private AccountMapper $accountMapper;
	private Encryption $encryption;
	private $logger;
	private $serverUrl;
	private ?string $userId;

	public function __construct(
		string $AppName,
		IRequest $request,
		IUserManager $userManager,
		SharedAccountMapper $sharedAccountMapper,
		AccountMapper $accountMapper,
		Encryption $encryption,
		ILogger $logger,
		?string $UserId = null,
	) {
		parent::__construct($AppName, $request);
		$this->logger = $logger;
		$this->userManager = $userManager;
		$this->userId = $UserId;
		$this->sharedAccountMapper = $sharedAccountMapper;
		$this->accountMapper = $accountMapper;
		$this->encryption = $encryption;
		$this->serverUrl = $request->getServerProtocol() . "://" . $request->getServerHost() . "/";
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function getByUser()
	{
		return $this->sharedAccountMapper->findAllByReceiver($this->userId);
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function getByAccount($id)
	{
		$activeShares = $this->sharedAccountMapper->findAllByAccount($id);

		$result = [];
		
		foreach ($activeShares as &$activeShare) {
			$receiver = $this->userManager->get($activeShare->getReceiverId());
			
			if (!is_null($receiver)) {
				array_push($result, $activeShare->customJson($receiver, $this->serverUrl . "avatar/" . $receiver->getUID() . "/64"));
			}
		}

		return $result;
	}

	/**
	 * @NoAdminRequired
	 */
	public function create($data)
	{	
		$errors = SharedAccountForm::validateCreate($data);

		if (count($errors) > 0) {
			return $errors;
		} else {
			$account = $this->accountMapper->find("secret", $data["accountSecret"], $this->userId);

			if (is_null($account)) {
				$errors["error"] = "The account to share does not exist";
				return $errors;
			} else if($account->getUserId() != $this->userId) {
				$errors["error"] = "You cannot share an account that is not yours";
				return $errors;
			}

			foreach ($data["users"] as $receiverId) {
				$accountShared = $this->sharedAccountMapper->findByReceiver($account->getId(), $receiverId);

				if(is_null($accountShared)) {
					$accountShared = new SharedAccount();

					$maxSharedAccountPos = $this->sharedAccountMapper->findMaxPosition($receiverId);
					$maxAccountPos = $this->accountMapper->findMaxPosition($receiverId);
		
					$position = max($maxSharedAccountPos, $maxAccountPos) + 1;
						
					$accountShared->setAccountId($account->getId());
					$accountShared->setReceiverId($receiverId);
					$accountShared->setName($account->getName());
					$accountShared->setIssuer($account->getIssuer());
					$accountShared->setSecret($data["sharedSecret"]);
					$accountShared->setPassword(password_hash($data["password"], PASSWORD_DEFAULT));
					$accountShared->setIv($data["iv"]);
					$accountShared->setIcon($account->getIcon());
					$accountShared->setPosition($position);
					$accountShared->setExpiredAt($data["expirationDate"] == null ? null : date('Y-m-d', strtotime($data["expirationDate"])));
					$accountShared->setCreatedAt(date("Y-m-d H:i:s"));
					$accountShared->setUpdatedAt(date("Y-m-d H:i:s"));
	
					$this->sharedAccountMapper->insert($accountShared);
				} else {
					$accountShared->setExpiredAt($data["expirationDate"] == null ? null : date('Y-m-d', strtotime($data["expirationDate"])));
					$this->sharedAccountMapper->update($accountShared);
				}
			}

			return "OK";
		}
	}

	/**
	 * @NoAdminRequired
	 */
	public function update($data)
	{
		$errors = SharedAccountForm::validateUpdate($data);

		if (count($errors) > 0) {
			return $errors;
		} else {
			$sharedAccount = $this->sharedAccountMapper->find("secret", $data["secret"], $this->userId);

			if ($sharedAccount == null) {
				$errors["msg"] = "This account does not exists";
				return $errors;
			}

			$sharedAccount->setName($data["name"]);
			$sharedAccount->setIssuer($data["issuer"]);
			
			$this->sharedAccountMapper->update($sharedAccount);

			return "OK";
		}
	}


	/**
	 * @NoAdminRequired
	 */
	public function delete(int $accountId)
	{		
		$receiverId = $this->request->getParam("receiver", null);

		if($this->sharedAccountMapper->unshare($accountId, $receiverId == null ? $this->userId : $receiverId)) {
			return;
		}

		return new JSONResponse(["error" => "There was an error while deleting your shared account"], 500); 
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function getUsers($accountId)
	{
		$result = $this->sharedAccountMapper->findUsers($this->userId, $accountId);

		$users = [];
		
		for ($i = 0; $i < count($result); $i++) {
			$user = $result[$i];

			array_push($users,  [
				"image" => $this->serverUrl . "avatar/" . $user["uid"] . "/64",
				"value" => $user["uid"],
				"label" => is_null($user["displayname"]) ? $user["uid"] : $user["displayname"],
			]);
		}

		return $users;
	}

	/**
	 * @NoAdminRequired
	 */
	public function unlock(int $accountId, string $currentPassword, string $tempPassword)
	{		
		$accountShared = $this->sharedAccountMapper->findByReceiver($accountId, $this->userId);
		
		if($accountShared == null)
			return new JSONResponse(["error" => "This shared account does not exists"], 400);

		
		if(!password_verify(hash("sha256", $tempPassword), $accountShared->getPassword()))
			return new JSONResponse(["error" => "The password is incorrect"], 400);

		$decryptedSecret = $this->encryption->decrypt($accountShared->getSecret(), $tempPassword, $accountShared->getIv());

		if($decryptedSecret === false) 
			return new JSONResponse(["error" => "There was an error while trying to decrypt the secret key"], 400);
		
		$encryptedSecret = $this->encryption->encrypt($decryptedSecret, $currentPassword, $this->userId, true);
		
		if($encryptedSecret === false) 
			return new JSONResponse(["error" => "There was an error while trying to encrypt the secret key"], 400);

		$accountShared->setSecret($encryptedSecret);
		$accountShared->setUnlocked(true);
		$this->sharedAccountMapper->update($accountShared);
	}

	/**
	 * @NoAdminRequired
	 */
	public function updateCounter(string $secret)
	{
		$account = $this->sharedAccountMapper->findAccountBySecret($this->userId, $secret);

		if($account == null) return new JSONResponse(["error" => "This account does not exists"], 400);
		if($account->getType() == "totp")  return new JSONResponse(["error" => "You cannot update counter of a TOTP account"], 400);

		$account->setCounter($account->getCounter() + 1);
		$this->accountMapper->update($account);

		return $account->getCounter();
	}
}

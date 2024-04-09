<?php

declare(strict_types=1);
// SPDX-FileCopyrightText: Matteo Convertino <matteo@convertino.cloud>
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace OCA\OtpManager\Controller;

use OCA\OtpManager\Db\SharedAccountMapper;
use OCA\OtpManager\Db\AccountMapper;
use OCA\OtpManager\Utils\Encryption;
use OCP\AppFramework\Http\JSONResponse;
use OCP\AppFramework\Http;
use OCP\AppFramework\OCSController;
use OCP\IRequest;

class SharedAccountApiController extends OCSController
{
	private SharedAccountMapper $sharedAccountMapper;
	private AccountMapper $accountMapper;
	private Encryption $encryption;
	private ?string $userId;

	public function __construct(
		string $AppName,
		IRequest $request,
		SharedAccountMapper $sharedAccountMapper,
		AccountMapper $accountMapper,
		Encryption $encryption,
		?string $UserId = null,
	) {
		parent::__construct($AppName, $request);
		$this->userId = $UserId;
		$this->sharedAccountMapper = $sharedAccountMapper;
		$this->accountMapper = $accountMapper;
		$this->encryption = $encryption;
	}

	/**
	 * @NoAdminRequired
	 */
	public function unlock(int $accountId, string $currentPassword, string $tempPassword): JSONResponse
	{
		$accountShared = $this->sharedAccountMapper->findByReceiver($accountId, $this->userId);

		if ($accountShared == null)
			return new JSONResponse(["error" => "This shared account does not exists"], Http::STATUS_NOT_FOUND);

		if ($accountShared->getUnlocked())
			return new JSONResponse(null, Http::STATUS_OK);

		if (!password_verify(hash("sha256", $tempPassword), $accountShared->getPassword()))
			return new JSONResponse(["error" => "The password is incorrect"], Http::STATUS_BAD_REQUEST);

		$decryptedSecret = $this->encryption->decrypt($accountShared->getSecret(), $tempPassword, $accountShared->getIv());

		if ($decryptedSecret === false)
			return new JSONResponse(["error" => "There was an error while trying to decrypt the secret key"], Http::STATUS_BAD_REQUEST);

		$encryptedSecret = $this->encryption->encrypt($decryptedSecret, $currentPassword, $this->userId, true);

		if ($encryptedSecret === false)
			return new JSONResponse(["error" => "There was an error while trying to encrypt the secret key"], Http::STATUS_BAD_REQUEST);

		$accountShared->setSecret($encryptedSecret);
		$accountShared->setUnlocked(true);
		$this->sharedAccountMapper->update($accountShared);

		return new JSONResponse(null, Http::STATUS_OK);
	}

	/**
	 * @NoAdminRequired
	 */
	public function updateCounter(string $secret): JSONResponse
	{
		$account = $this->sharedAccountMapper->findAccountBySecret($this->userId, $secret);

		if ($account == null) return new JSONResponse(["error" => "This account does not exists"], Http::STATUS_NOT_FOUND);
		if ($account->getType() == "totp")  return new JSONResponse(["error" => "You cannot update counter of a TOTP account"], Http::STATUS_BAD_REQUEST);

		$account->setCounter($account->getCounter() + 1);
		$this->accountMapper->update($account);

		return new JSONResponse($account->getCounter(), Http::STATUS_OK);
	}
}

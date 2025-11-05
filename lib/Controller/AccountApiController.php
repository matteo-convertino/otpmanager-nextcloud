<?php

declare(strict_types=1);

namespace OCA\OtpManager\Controller;

use OCA\OtpManager\Db\AccountMapper;
use OCP\AppFramework\Http\JSONResponse;
use OCP\IRequest;
use OCP\AppFramework\Http;
use OCP\AppFramework\OCSController;

class AccountApiController extends OCSController
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

	/**
	 * @NoAdminRequired
	 */
	public function updateCounter(string $secret): JSONResponse
	{
		$account = $this->accountMapper->find("secret", $secret, $this->userId);

		if ($account == null) return new JSONResponse(["error" => "This account does not exists"], Http::STATUS_NOT_FOUND);
		if ($account->getType() == "totp")  return new JSONResponse(["error" => "You cannot update counter of a TOTP account"], Http::STATUS_NOT_FOUND);

		$account->setCounter($account->getCounter() + 1);
		$this->accountMapper->update($account);

		return new JSONResponse($account->getCounter(), Http::STATUS_OK);
	}
}

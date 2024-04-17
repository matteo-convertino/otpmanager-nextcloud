<?php

declare(strict_types=1);
// SPDX-FileCopyrightText: Matteo Convertino <matteo@convertino.cloud>
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace OCA\OtpManager\Controller;

use OCA\OtpManager\Db\AccountMapper;
use OCA\OtpManager\Db\SharedAccountMapper;
use OCP\AppFramework\Http\JSONResponse;
use OCA\OtpManager\Utils\SyncAccount;
use OCA\OtpManager\Utils\SyncSharedAccount;
use OCP\AppFramework\Http;
use OCP\AppFramework\OCSController;
use OCP\IRequest;

class SyncApiController extends OCSController
{
	private SyncAccount $syncAccount;
	private SyncSharedAccount $syncSharedAccount;

	public function __construct(
		string $AppName,
		IRequest $request,
		AccountMapper $accountMapper,
		SharedAccountMapper $sharedAccountMapper,
		?string $UserId = null
	) {
		parent::__construct($AppName, $request);
		$this->syncAccount = new SyncAccount($accountMapper, $UserId, $sharedAccountMapper);
		$this->syncSharedAccount = new SyncSharedAccount($sharedAccountMapper, $UserId);
	}

	/**
	 * @NoAdminRequired
	 */
	public function update(?array $accounts, ?array $sharedAccounts, ?string $appVersion): JSONResponse
	{
		if (is_null($accounts) || is_null($sharedAccounts) || is_null($appVersion)) return new JSONResponse(["error" => "Please update mobile app to the latest version"], Http::STATUS_BAD_REQUEST);

		$appVersion = explode(".", $appVersion);

		$major = $appVersion[0];
		$minor = $appVersion[1];
		$patch = $appVersion[2];

		if ($major == 1 && $minor >= 5 && $patch >= 1) {
			return new JSONResponse(
				[
					"accounts" => $this->syncAccount->sync($accounts),
					"sharedAccounts" => $this->syncSharedAccount->sync($sharedAccounts),
				],
				Http::STATUS_OK
			);
		} else {
			return new JSONResponse(
				["error" => "Please update mobile app to the latest version"],
				Http::STATUS_BAD_REQUEST
			);
		}
	}
}

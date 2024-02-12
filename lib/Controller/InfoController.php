<?php

declare(strict_types=1);
// SPDX-FileCopyrightText: Matteo Convertino <matteo@convertino.cloud>
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace OCA\OtpManager\Controller;

use OCP\AppFramework\Controller;

use OCP\IRequest;
use OCP\App\IAppManager;


class InfoController extends Controller
{
	private IAppManager $appManager;

	public function __construct(
		string $AppName,
		IRequest $request,
		IAppManager $appManager,
	) {
		parent::__construct($AppName, $request);
		$this->appManager = $appManager;
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	/*public function get()
	{
		return $this->appManager->getAppVersion($this->appName, useCache: false);
	}*/
}

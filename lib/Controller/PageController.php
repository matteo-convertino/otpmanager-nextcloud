<?php
declare(strict_types=1);
// SPDX-FileCopyrightText: Matteo Convertino <matteo@convertino.cloud>
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace OCA\OtpManager\Controller;

use OCA\OtpManager\Db\AccountMapper;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\IRequest;
use OCP\Util;

class PageController extends Controller {

	public function __construct(string $AppName, IRequest $request, AccountMapper $mapper, ?string $UserId = null){
		parent::__construct($AppName, $request);
		$this->mapper = $mapper;
		$this->userId = $UserId;
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function index(): TemplateResponse {
		Util::addScript($this->appName, 'otpmanager-main');

		//throw new \Exception(print_r($accounts));
		return new TemplateResponse($this->appName, 'main');
	}
}

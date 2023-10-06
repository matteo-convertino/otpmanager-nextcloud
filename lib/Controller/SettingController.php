<?php
declare(strict_types=1);
// SPDX-FileCopyrightText: Matteo Convertino <matteo@convertino.cloud>
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace OCA\OtpManager\Controller;

use OCA\OtpManager\Db\Setting;
use OCA\OtpManager\Db\SettingMapper;
use OCP\AppFramework\Controller;
use OCP\IRequest;


class SettingController extends Controller {

	private SettingMapper $settingMapper;
    private ?string $userId;

	public function __construct(
		string $AppName, 
		IRequest $request, 
		SettingMapper $settingMapper, 
		?string $UserId = null
	){
		parent::__construct($AppName, $request);
		$this->settingMapper = $settingMapper;
		$this->userId = $UserId;
	}

	/**
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 */
	public function get() {
		return $this->settingMapper->find($this->userId);
	}
	
	/**
	 * @NoAdminRequired
	 */
	public function save(?bool $showCodes, ?bool $darkMode, ?string $recordsPerPage) {
		$setting = $this->settingMapper->find($this->userId);

		$perPageAvailable = ["10", "20", "30", "All"];
		
		if(!is_null($showCodes)) $setting->setShowCodes($showCodes);
		if(!is_null($darkMode)) $setting->setDarkMode($darkMode);
		if(!is_null($recordsPerPage) && in_array($recordsPerPage, $perPageAvailable)) $setting->setRecordsPerPage($recordsPerPage);

		return $this->settingMapper->update($setting);
	}

}

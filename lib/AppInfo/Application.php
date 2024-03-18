<?php
declare(strict_types=1);
// SPDX-FileCopyrightText: Matteo Convertino <matteo@convertino.cloud>
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace OCA\OtpManager\AppInfo;

use OCP\AppFramework\App;

class Application extends App {
	public const APP_ID = 'otpmanager';
	public const ACCOUNTS_DB = 'otpmanager_accounts';
	public const SETTINGS_DB = 'otpmanager_settings';
	public const SHARED_ACCOUNTS_DB = 'otpmanager_shared';

	public function __construct() {
		parent::__construct(self::APP_ID);
	}
}

<?php
declare(strict_types=1);
// SPDX-FileCopyrightText: Matteo Convertino <matteo@convertino.cloud>
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace OCA\OtpManager\Db;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;


class Setting extends Entity implements JsonSerializable {

	protected $showCodes;
	protected $darkMode;
	protected $recordsPerPage;
    protected $userId;
	
	public function __construct() {
        $this->addType('id', 'integer');
		$this->addType('showCodes', 'boolean');
		$this->addType('darkMode', 'boolean');
    }

	public function jsonSerialize(): array {
		return [
			'id' => $this->id,
			'show_codes' => $this->showCodes,
			'dark_mode' => $this->darkMode,
			'records_per_page' => $this->recordsPerPage,
			'user_id' => $this->userId
		];
	}
}

<?php
declare(strict_types=1);
// SPDX-FileCopyrightText: Matteo Convertino <matteo@convertino.cloud>
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace OCA\OtpManager\Db;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;


class Account extends Entity implements JsonSerializable {

	protected $secret;
	protected $name;
	protected $issuer;
	protected $digits;
	protected $type;
	protected $period;
	protected $algorithm;
	protected $counter;
	protected $position;
	protected $userId;
	protected $createdAt;
	protected $updatedAt;
	protected $deletedAt;
	
	public function __construct() {
        $this->addType('id', 'integer');
        $this->addType('position', 'integer');
		$this->addType('digits', 'integer');
		$this->addType('period', 'integer');
		$this->addType('counter', 'integer');
    }

	public function jsonSerialize(): array {
		return [
			'id' => $this->id,
			'secret' => $this->secret,
			'name' => $this->name,
			'issuer' => $this->issuer,
			'digits' => $this->digits,
			'type' => $this->type,
			'period' => $this->period,
			'algorithm' => $this->algorithm,
			'counter' => $this->counter,
			'position' => $this->position,
			'user_id' => $this->userId,
			'created_at' => $this->createdAt,
			'updated_at' => $this->updatedAt,
			'deleted_at' => $this->deletedAt
		];
	}
}

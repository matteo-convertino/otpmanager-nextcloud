<?php
declare(strict_types=1);
// SPDX-FileCopyrightText: Matteo Convertino <matteo@convertino.cloud>
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace OCA\OtpManager\Db;

use JsonSerializable;

use OCP\AppFramework\Db\Entity;
use OCP\IUser;

class SharedAccount extends Entity implements JsonSerializable {

	protected $accountId;
	protected $receiverId;
	protected $name;
	protected $issuer;
	protected $secret;
	protected $icon;
	protected $position;
	protected $unlocked;
	protected $password;
	protected $iv;
    protected $expiredAt;
    protected $createdAt;
	protected $updatedAt;
	
	public function __construct() {
        $this->addType('id', 'integer');
		$this->addType('accountId', 'integer');
		//$this->addType('receiverId', 'integer');
		$this->addType('position', 'integer');
		$this->addType('unlocked', 'boolean');
    }

	public function jsonSerialize(): array {
		return [
			'id' => $this->id,
			'account_id' => $this->accountId,
			'receiver_id' => $this->receiverId,
			'name' => $this->name,
			'issuer' => $this->issuer,
			'secret' => $this->secret,
			'icon' => $this->icon,
			'position' => $this->position,
			'unlocked' => $this->unlocked,
			'expired_at' => $this->expiredAt,
			'created_at' => $this->createdAt,
			'updated_at' => $this->updatedAt,
		];
	}

	public function customJson(IUser $receiver, string $imageUrl): array {
		return [
			'id' => $this->id,
			'account_id' => $this->accountId,
			'receiver' => [
				"image" => $imageUrl,
				"value" => $receiver->getUID(),
				"label" => $receiver->getDisplayName(),				
			],
			'name' => $this->name,
			'issuer' => $this->issuer,
			'secret' => $this->secret,
			'icon' => $this->icon,
			'position' => $this->position,
			'unlocked' => $this->unlocked,
			'expired_at' => $this->expiredAt,
			'created_at' => $this->createdAt,
			'updated_at' => $this->updatedAt,
		];
	}
}

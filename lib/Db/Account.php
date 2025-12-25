<?php

declare(strict_types=1);

namespace OCA\OtpManager\Db;

use DateTime;
use JsonSerializable;

use OCP\AppFramework\Db\Entity;

/**
 * @method string|null getSecret()
 * @method void setSecret(string|null $secret)
 *
 * @method string|null getName()
 * @method void setName(string|null $name)
 *
 * @method string|null getIssuer()
 * @method void setIssuer(string|null $issuer)
 *
 * @method int|null getDigits()
 * @method void setDigits(int|null $digits)
 *
 * @method string|null getType()
 * @method void setType(string|null $type)
 *
 * @method int|null getPeriod()
 * @method void setPeriod(int|null $period)
 *
 * @method int|null getAlgorithm()
 * @method void setAlgorithm(int|null $algorithm)
 *
 * @method int|null getCounter()
 * @method void setCounter(int|null $counter)
 *
 * @method string|null getIcon()
 * @method void setIcon(string|null $icon)
 *
 * @method int|null getPosition()
 * @method void setPosition(int|null $position)
 *
 * @method string|null getUserId()
 * @method void setUserId(string|null $userId)
 *
 * @method int|string|null getCreatedAt()
 * @method void setCreatedAt(string|null $createdAt)
 *
 * @method int|string|null getUpdatedAt()
 * @method void setUpdatedAt(string|null $updatedAt)
 *
 * @method int|string|null getDeletedAt()
 * @method void setDeletedAt(string|null $deletedAt)
 */
class Account extends Entity implements JsonSerializable
{

	protected $secret;
	protected $name;
	protected $issuer;
	protected $digits;
	protected $type;
	protected $period;
	protected $algorithm;
	protected $counter;
	protected $icon;
	protected $position;
	protected $userId;
	protected $createdAt;
	protected $updatedAt;
	protected $deletedAt;

	public function __construct()
	{
		$this->addType('id', 'integer');
		$this->addType('digits', 'integer');
		$this->addType('period', 'integer');
		$this->addType('algorithm', 'integer');
		$this->addType('counter', 'integer');
		$this->addType('position', 'integer');
	}

	public function jsonSerialize(): array
	{
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
			'icon' => $this->icon,
			'position' => $this->position,
			'user_id' => $this->userId,
			'created_at' => $this->createdAt,
			'updated_at' => $this->updatedAt,
			'deleted_at' => $this->deletedAt
		];
	}
}

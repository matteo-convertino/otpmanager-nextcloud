<?php

declare(strict_types=1);

namespace OCA\OtpManager\Db;

use JsonSerializable;
use OCP\AppFramework\Db\Entity;
use OCP\IUser;

/**
 * @method int|null getAccountId()
 * @method void setAccountId(int|null $accountId)
 *
 * @method string|null getReceiverId()
 * @method void setReceiverId(string|null $receiverId)
 *
 * @method string|null getName()
 * @method void setName(string|null $name)
 *
 * @method string|null getIssuer()
 * @method void setIssuer(string|null $issuer)
 *
 * @method string|null getSecret()
 * @method void setSecret(string|null $secret)
 *
 * @method string|null getIcon()
 * @method void setIcon(string|null $icon)
 *
 * @method int|null getPosition()
 * @method void setPosition(int|null $position)
 *
 * @method bool|null getUnlocked()
 * @method void setUnlocked(bool|null $unlocked)
 *
 * @method string|null getPassword()
 * @method void setPassword(string|null $password)
 *
 * @method string|null getIv()
 * @method void setIv(string|null $iv)
 *
 * @method int|string|null getExpiredAt()
 * @method void setExpiredAt(string|null $expiredAt)
 *
 * @method int|string|null getCreatedAt()
 * @method void setCreatedAt(string|null $createdAt)
 *
 * @method int|string|null getUpdatedAt()
 * @method void setUpdatedAt(string|null $updatedAt)
 */
class SharedAccount extends Entity implements JsonSerializable
{

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

    public function __construct()
    {
        $this->addType('id', 'integer');
        $this->addType('accountId', 'integer');
        //$this->addType('receiverId', 'integer');
        $this->addType('position', 'integer');
        $this->addType('unlocked', 'boolean');
    }

    public function jsonSerialize(): array
    {
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

    public function customJson(IUser $receiver, string $imageUrl): array
    {
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

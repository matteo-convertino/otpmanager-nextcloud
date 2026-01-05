<?php

declare(strict_types=1);

namespace OCA\OtpManager\Db;

use JsonSerializable;
use OCP\AppFramework\Db\Entity;


/**
 * @method bool|null getShowCodes()
 * @method void setShowCodes(bool|null $showCodes)
 *
 * @method bool|null getDarkMode()
 * @method void setDarkMode(bool|null $darkMode)
 *
 * @method string|null getRecordsPerPage()
 * @method void setRecordsPerPage(string|null $recordsPerPage)
 *
 * @method string|null getPassword()
 * @method void setPassword(string|null $password)
 *
 * @method string|null getIv()
 * @method void setIv(string|null $iv)
 *
 * @method string|null getUserId()
 * @method void setUserId(string|null $userId)
 */
class Setting extends Entity implements JsonSerializable
{

    protected $showCodes;
    protected $darkMode;
    protected $recordsPerPage;
    protected $password;
    protected $iv;
    protected $userId;

    public function __construct()
    {
        $this->addType('id', 'integer');
        $this->addType('showCodes', 'boolean');
        $this->addType('darkMode', 'boolean');
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'show_codes' => $this->showCodes,
            'dark_mode' => $this->darkMode,
            'records_per_page' => $this->recordsPerPage,
            'user_id' => $this->userId
        ];
    }
}

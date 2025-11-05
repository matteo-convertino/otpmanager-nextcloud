<?php

declare(strict_types=1);

namespace OCA\OtpManager\Controller;

use OCA\OtpManager\Db\SettingMapper;
use OCP\AppFramework\Http\JSONResponse;
use OCP\AppFramework\OCSController;
use OCP\IRequest;


class PasswordApiController extends OCSController
{
    private SettingMapper $settingMapper;
    private ?string $userId;

    public function __construct(
        string        $AppName,
        IRequest      $request,
        SettingMapper $settingMapper,
        ?string       $UserId = null
    )
    {
        parent::__construct($AppName, $request);
        $this->settingMapper = $settingMapper;
        $this->userId = $UserId;
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function check(string $password): JSONResponse
    {
        $setting = $this->settingMapper->find($this->userId);
        if (is_null($setting) || is_null($setting->getPassword())) return new JSONResponse(["error" => "No password set yet"], 400);

        if (password_verify(hash("sha256", $password), $setting->getPassword())) {
            return new JSONResponse(["iv" => $setting->getIv()]);
        } else {
            return new JSONResponse(["error" => "Incorrect password"], 400);
        }
    }
}

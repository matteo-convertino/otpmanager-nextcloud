<?php

declare(strict_types=1);
// SPDX-FileCopyrightText: Matteo Convertino <matteo@convertino.cloud>
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace OCA\OtpManager\Controller;

use OCA\OtpManager\Db\Setting;
use OCA\OtpManager\Db\SettingMapper;
use OCA\OtpManager\Utils\Encryption;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\JSONResponse;
use OCP\IRequest;


class PasswordController extends Controller
{

    private SettingMapper $settingMapper;
    private Encryption $encryption;
    private ?string $userId;

    public function __construct(
        string $AppName,
        IRequest $request,
        SettingMapper $settingMapper,
        Encryption $encryption,
        ?string $UserId = null
    ) {
        parent::__construct($AppName, $request);
        $this->settingMapper = $settingMapper;
        $this->encryption = $encryption;
        $this->userId = $UserId;
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function get(): bool
    {
        $setting = $this->settingMapper->find($this->userId);

        if (is_null($setting)) {
            $setting = new Setting();
            $setting->setShowCodes(false);
            $setting->setDarkMode(true);
            $setting->setRecordsPerPage("10");
            $setting->setUserId($this->userId);
            $this->settingMapper->insert($setting);
            return false;
        }

        return !is_null($setting->getPassword());
    }

    private function validatePassword($password): bool
    {

        if (!preg_match("/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$&+,:;=?@#|'<>.^*()%!-]).{6,}$/", $password)) {
            return false;
        }

        return true;
    }

    /**
     * @NoAdminRequired
     */
    public function create(string $password): JSONResponse
    {

        if (!$this->validatePassword($password)) return new JSONResponse(["error" => "Not all requirements are satisfied"], 400);

        $setting = $this->settingMapper->find($this->userId);

        if (!is_null($setting->getPassword())) return new JSONResponse(["error" => "Password already set"], 400);

        $password = hash("sha256", $password);

        $iv = bin2hex(random_bytes(16));

        $this->encryption->encryptAccounts($password, $iv, $this->userId);

        $setting->setPassword($password);
        $setting->setIv($iv);
        $this->settingMapper->update($setting);

        return new JSONResponse(["iv" => $setting->getIv()]);
    }

    /**
     * @NoAdminRequired
     */
    public function update(string $oldPassword, string $newPassword): JSONResponse
    {

        if (!$this->validatePassword($newPassword)) return new JSONResponse(["error" => "Not all requirements are satisfied"], 400);

        $setting = $this->settingMapper->find($this->userId);

        //return new JSONResponse(["a" => hash_equals($setting->getPassword(), hash("sha256", $oldPassword)), "b" => $oldPassword, "c" => $setting->getPassword(), "d" => hash("sha256", $oldPassword)]);

        if (is_null($setting->getPassword())) return new JSONResponse(["error" => "No password set yet"], 400);
        else if (!hash_equals($setting->getPassword(), hash("sha256", $oldPassword))) return new JSONResponse(["error" => "The old password is incorrect"], 400);

        $newPassword = hash("sha256", $newPassword);

        $newIv = bin2hex(random_bytes(16));

        $this->encryption->changeAccountsEncryption($setting->getPassword(), $newPassword, $setting->getIv(), $newIv, $this->userId);

        $setting->setPassword($newPassword);
        $setting->setIv($newIv);
        $this->settingMapper->update($setting);

        return new JSONResponse(["iv" => $setting->getIv()]);
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function check(string $password): JSONResponse
    {
        $setting = $this->settingMapper->find($this->userId);
        if (is_null($setting) || is_null($setting->getPassword())) return new JSONResponse(["error" => "No password set yet"], 400);

        if (hash_equals($setting->getPassword(), hash("sha256", $password))) {
            return new JSONResponse(["iv" => $setting->getIv()]);
        } else {
            return new JSONResponse(["error" => "Incorrect password"], 400);
        }
    }
}

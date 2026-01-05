<?php

declare(strict_types=1);

namespace OCA\OtpManager\Service;

use OCA\OtpManager\Db\Setting;
use OCA\OtpManager\Db\SettingMapper;
use OCA\OtpManager\Dto\Request\PasswordCreateRequestDto;
use OCA\OtpManager\Dto\Request\PasswordUpdateRequestDto;
use OCA\OtpManager\Dto\Response\PasswordResponseDto;
use OCA\OtpManager\Dto\Response\PasswordStatusResponseDto;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\OCS\OCSBadRequestException;
use OCP\AppFramework\OCS\OCSException;

class PasswordService
{
    private SettingMapper $settingMapper;
    private EncryptionService $encryption;
    private ?string $userId;

    public function __construct(
        SettingMapper     $settingMapper,
        EncryptionService $encryption,
        ?string           $UserId = null
    )
    {
        $this->settingMapper = $settingMapper;
        $this->encryption = $encryption;
        $this->userId = $UserId;
    }

    /**
     * @param PasswordCreateRequestDto $passwordRequestDto
     * @return DataResponse<PasswordResponseDto>
     * @throws OCSBadRequestException
     */
    public function check(PasswordCreateRequestDto $passwordRequestDto): DataResponse
    {
        $setting = $this->settingMapper->find($this->userId);

        if (is_null($setting) || is_null($setting->getPassword())) throw new OCSBadRequestException("No password set yet");

        if (!password_verify(hash("sha256", $passwordRequestDto->password), $setting->getPassword()))
            throw new OCSBadRequestException("Incorrect password");

        return new DataResponse(new PasswordResponseDto(iv: $setting->getIv()));
    }

    /**
     * @return DataResponse<PasswordResponseDto>
     * @throws OCSException
     */
    public function status(): DataResponse
    {
        $setting = $this->settingMapper->find($this->userId);

        if (is_null($setting)) {
            $setting = new Setting();
            $setting->setShowCodes(false);
            $setting->setDarkMode(true);
            $setting->setRecordsPerPage("10");
            $setting->setUserId($this->userId);

            try {
                $this->settingMapper->insert($setting);
            } catch (\Exception) {
                throw new OCSException("There was an error while creating user's settings", 500);
            }

            return new DataResponse(new PasswordStatusResponseDto(hasPassword: false));
        }

        return new DataResponse(new PasswordStatusResponseDto(hasPassword: !is_null($setting->getPassword())));
    }

    /**
     * @param PasswordCreateRequestDto $passwordRequestDto
     * @return DataResponse<PasswordResponseDto>
     * @throws OCSBadRequestException | OCSException
     */
    public function create(PasswordCreateRequestDto $passwordRequestDto): DataResponse
    {
        $setting = $this->settingMapper->find($this->userId);

        if (!is_null($setting->getPassword())) throw new OCSBadRequestException("Password already set");

        $password = hash("sha256", $passwordRequestDto->password);

        try {
            $iv = bin2hex(random_bytes(16));
        } catch (\Exception) {
            throw new OCSException("There was an error while generating random IV (encryption)", 500);
        }

        $this->encryption->encryptAccounts($password, $iv, $this->userId);

        $setting->setPassword(password_hash($password, PASSWORD_DEFAULT));
        $setting->setIv($iv);

        try {
            $this->settingMapper->update($setting);
        } catch (\Exception) {
            throw new OCSException("There was an error while updating user's settings", 500);
        }

        return new DataResponse(new PasswordResponseDto(iv: $setting->getIv()));
    }

    /**
     * @param PasswordUpdateRequestDto $passwordUpdateRequestDto
     * @return DataResponse<PasswordResponseDto>
     * @throws OCSBadRequestException | OCSException
     */
    public function update(PasswordUpdateRequestDto $passwordUpdateRequestDto): DataResponse
    {
        $setting = $this->settingMapper->find($this->userId);

        if (is_null($setting->getPassword()))
            throw new OCSBadRequestException("No password set yet");
        else if (!password_verify(hash("sha256", $passwordUpdateRequestDto->oldPassword), $setting->getPassword()))
            throw new OCSBadRequestException("The old password is incorrect");

        $newPassword = hash("sha256", $passwordUpdateRequestDto->newPassword);

        try {
            $newIv = bin2hex(random_bytes(16));
        } catch (\Exception) {
            throw new OCSException("There was an error while generating random IV (encryption)", 500);
        }

        $this->encryption->changeAccountsEncryption(
            oldPassword: hash("sha256", $passwordUpdateRequestDto->oldPassword),
            newPassword: $newPassword,
            oldIv: $setting->getIv(),
            newIv: $newIv,
            userId: $this->userId
        );

        $setting->setPassword(password_hash($newPassword, PASSWORD_DEFAULT));
        $setting->setIv($newIv);

        try {
            $this->settingMapper->update($setting);
        } catch (\Exception) {
            throw new OCSException("There was an error while updating user's settings", 500);
        }

        return new DataResponse(new PasswordResponseDto(iv: $setting->getIv()));
    }
}
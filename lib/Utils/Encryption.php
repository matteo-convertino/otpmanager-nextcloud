<?php

declare(strict_types=1);

namespace OCA\OtpManager\Utils;

use OCA\OtpManager\Db\AccountMapper;
use OCA\OtpManager\Db\SettingMapper;

class Encryption
{
    private AccountMapper $accountMapper;
    private SettingMapper $settingMapper;

    private const CIPHER_ALGO = "aes-256-cbc";

    public function __construct(
        AccountMapper $accountMapper,
        SettingMapper $settingMapper,
    ) {
        $this->accountMapper = $accountMapper;
        $this->settingMapper = $settingMapper;
    }

    public function encrypt($data, $password, $userId, $isAlreadyHashed = false): string | false
    {
        $setting = $this->settingMapper->find($userId);

        if (is_null($setting->getPassword())) return false;

        $password = $isAlreadyHashed ? $password : hash("sha256", $password);

        return openssl_encrypt($data, $this::CIPHER_ALGO, hex2bin($password), 0, hex2bin($setting->getIv()));
    }

    /*public function decrypt($data, $userId): string | false
    {
        $setting = $this->settingMapper->find($userId);

        if (is_null($setting->getPassword())) return false;

        return openssl_decrypt($data, $this::CIPHER_ALGO, hex2bin($setting->getPassword()), 0, hex2bin($setting->getIv()));
    }*/

    public function decrypt($data, $password, $iv, $isAlreadyHashed = false): string | false
    {
        $password = $isAlreadyHashed ? $password : hash("sha256", $password);

        return openssl_decrypt($data, $this::CIPHER_ALGO, hex2bin($password), 0, hex2bin($iv));
    }

    public function encryptAccounts($password, $iv, $userId)
    {
        $accounts = $this->accountMapper->findAllWithDeleted($userId);

        foreach ($accounts as $account) {
            $account->setSecret(openssl_encrypt($account->getSecret(), $this::CIPHER_ALGO, hex2bin($password), 0, hex2bin($iv)));

            $this->accountMapper->update($account);
        }
    }

    public function changeAccountsEncryption($oldPassword, $newPassword, $oldIv, $newIv, $userId)
    {
        $accounts = $this->accountMapper->findAllWithDeleted($userId);

        foreach ($accounts as $account) {
            $secret = openssl_decrypt($account->getSecret(), $this::CIPHER_ALGO, hex2bin($oldPassword), 0, hex2bin($oldIv));
            $account->setSecret(openssl_encrypt($secret, $this::CIPHER_ALGO, hex2bin($newPassword), 0, hex2bin($newIv)));

            $this->accountMapper->update($account);
        }
    }
}

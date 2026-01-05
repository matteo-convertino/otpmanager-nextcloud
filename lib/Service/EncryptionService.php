<?php

declare(strict_types=1);

namespace OCA\OtpManager\Service;

use OCA\OtpManager\Db\AccountMapper;
use OCA\OtpManager\Db\SettingMapper;
use OCA\OtpManager\Db\SharedAccountMapper;
use OCP\AppFramework\OCS\OCSException;

class EncryptionService
{
    private AccountMapper $accountMapper;
    private SettingMapper $settingMapper;
    private SharedAccountMapper $sharedAccountMapper;

    private const CIPHER_ALGO = "aes-256-cbc";

    public function __construct(
        AccountMapper       $accountMapper,
        SettingMapper       $settingMapper,
        SharedAccountMapper $sharedAccountMapper,
    )
    {
        $this->accountMapper = $accountMapper;
        $this->settingMapper = $settingMapper;
        $this->sharedAccountMapper = $sharedAccountMapper;
    }

    /**
     * @param string $data
     * @param string $password
     * @param string $userId
     * @param bool $isAlreadyHashed
     * @return string|false
     */
    public function encrypt(string $data, string $password, string $userId, bool $isAlreadyHashed = false): string|false
    {
        $setting = $this->settingMapper->find($userId);

        if (is_null($setting->getPassword())) return false;

        $password = $isAlreadyHashed ? $password : hash("sha256", $password);

        return openssl_encrypt($data, $this::CIPHER_ALGO, hex2bin($password), 0, hex2bin($setting->getIv()));
    }

    /**
     * @param string $data
     * @param string $password
     * @param string $iv
     * @param bool $isAlreadyHashed
     * @return string|false
     */
    public function decrypt(string $data, string $password, string $iv, bool $isAlreadyHashed = false): string|false
    {
        $password = $isAlreadyHashed ? $password : hash("sha256", $password);

        return openssl_decrypt($data, $this::CIPHER_ALGO, hex2bin($password), 0, hex2bin($iv));
    }

    /**
     * @param string $password
     * @param string $iv
     * @param string $userId
     * @return void
     * @throws OCSException
     */
    public function encryptAccounts(string $password, string $iv, string $userId): void
    {
        $accounts = $this->accountMapper->findAllWithDeleted($userId);

        foreach ($accounts as $account) {
            $account->setSecret(openssl_encrypt($account->getSecret(), $this::CIPHER_ALGO, hex2bin($password), 0, hex2bin($iv)));

            $this->accountMapper->update($account);
        }
    }


    /**
     * @param string $oldPassword
     * @param string $newPassword
     * @param string $oldIv
     * @param string $newIv
     * @param string $userId
     * @return void
     * @throws OCSException
     */
    public function changeAccountsEncryption(string $oldPassword, string $newPassword, string $oldIv, string $newIv, string $userId): void
    {
        $accounts = $this->accountMapper->findAllWithDeleted($userId);

        foreach ($accounts as $account) {
            $secret = openssl_decrypt($account->getSecret(), $this::CIPHER_ALGO, hex2bin($oldPassword), 0, hex2bin($oldIv));
            $account->setSecret(openssl_encrypt($secret, $this::CIPHER_ALGO, hex2bin($newPassword), 0, hex2bin($newIv)));

            $this->accountMapper->update($account);
        }

        $sharedAccounts = $this->sharedAccountMapper->findAllByReceiver($userId);

        foreach ($sharedAccounts as $sharedAccount) {
            if ($sharedAccount->getUnlocked()) {
                $secret = openssl_decrypt($sharedAccount->getSecret(), $this::CIPHER_ALGO, hex2bin($oldPassword), 0, hex2bin($oldIv));
                $sharedAccount->setSecret(openssl_encrypt($secret, $this::CIPHER_ALGO, hex2bin($newPassword), 0, hex2bin($newIv)));

                $this->sharedAccountMapper->update($sharedAccount);
            }
        }
    }
}

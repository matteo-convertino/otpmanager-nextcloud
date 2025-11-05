<?php

namespace OCA\OtpManager\Migration;

use OCA\OtpManager\Db\SettingMapper;
use OCP\DB\Exception;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;

class Version000012Date20240210103500 extends SimpleMigrationStep
{
    private SettingMapper $settingMapper;

    public function __construct(SettingMapper $settingMapper)
    {
        $this->settingMapper = $settingMapper;
    }

    /**
     * @throws Exception
     */
    public function postSchemaChange(IOutput $output, \Closure $schemaClosure, array $options): void
    {
        $settings = $this->settingMapper->findAll();

        foreach ($settings as $setting) {
            $setting->setPassword(password_hash($setting->getPassword(), PASSWORD_DEFAULT));

            $this->settingMapper->update($setting);
        }
    }
}
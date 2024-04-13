<?php

namespace OCA\OtpManager\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
use OCP\Migration\SimpleMigrationStep;
use OCP\Migration\IOutput;
use OCA\OtpManager\Db\SettingMapper;

class Version000012Date20240210103500 extends SimpleMigrationStep
{
	private SettingMapper $settingMapper;

	public function __construct(SettingMapper $settingMapper) {
		$this->settingMapper = $settingMapper;
	}

	public function postSchemaChange(IOutput $output, \Closure $schemaClosure, array $options) {
		$settings = $this->settingMapper->findAll();

        foreach ($settings as $setting) {
            $setting->setPassword(password_hash($setting->getPassword(), PASSWORD_DEFAULT));

            $this->settingMapper->update($setting);
        }
	}
}
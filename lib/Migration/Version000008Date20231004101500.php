<?php

namespace OCA\OtpManager\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
use OCP\Migration\SimpleMigrationStep;
use OCP\Migration\IOutput;
use OCA\OtpManager\AppInfo\Application;

class Version000008Date20231004101500 extends SimpleMigrationStep
{
	/**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array $options
	 * @return null|ISchemaWrapper
	 */
	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options)
	{
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();

		if (!$schema->hasTable(Application::SETTINGS_DB)) {
			$table = $schema->createTable(Application::SETTINGS_DB);
			$table->addColumn('id', 'integer', [
				'autoincrement' => true,
				'notnull' => true,
			]);

			$table->addColumn('show_codes', 'boolean', [
				'notnull' => false,
				'length' => 1,
				'default' => false,
			]);
			$table->addColumn('dark_mode', 'boolean', [
				'notnull' => false,
				'length' => 1,
				'default' => true,
			]);
			$table->addColumn('records_per_page', 'string', [
				'notnull' => false,
				'length' => 5,
				'default' => "10",
			]);

			$table->addColumn('user_id', 'string', [
				'notnull' => true,
				'length' => 64,
			]);

			$table->setPrimaryKey(['id']);
			$table->addUniqueIndex(['user_id'], 'otpmanager_sett_user_id_uindex');
			$table->addIndex(['user_id'], 'otpmanager_sett_user_id_index');
		}

		return $schema;
	}
}

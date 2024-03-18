<?php

namespace OCA\OtpManager\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
use OCP\Migration\SimpleMigrationStep;
use OCP\Migration\IOutput;
use OCA\OtpManager\AppInfo\Application;

class Version000013Date20240213150000 extends SimpleMigrationStep
{

	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options)
	{
		/** @var ISchemaWrapper $schema */
		$schema = $schemaClosure();

		if (!$schema->hasTable(Application::SHARED_ACCOUNTS_DB)) {
			$table = $schema->createTable(Application::SHARED_ACCOUNTS_DB);

			$table->addColumn('id', 'integer', [
				'autoincrement' => true,
				'notnull' => true,
			]);
			$table->addColumn('account_id', 'integer', [
				'notnull' => true,
			]);
			$table->addColumn('receiver_id', 'string', [
				'notnull' => true,
				'length' => 64,
			]);

			// secret is different because it has to be encrypted with the receiver user's password
			$table->addColumn('secret', 'string', [
				'notnull' => true,
				'length' => 512
			]);

			// customizable fields
			$table->addColumn('name', 'string', [
				'notnull' => true,
				'length' => 256,
			]);
			$table->addColumn('issuer', 'string', [
				'notnull' => true,
				'length' => 256,
			]);
			$table->addColumn('icon', 'string', [
				'notnull' => false,
				'default' => 'default',
			]);
			$table->addColumn('position', 'integer', [
				'notnull' => false,
			]);

			$table->addColumn('unlocked', 'boolean', [
				'notnull' => false,
				'length' => 1,
				'default' => false,
			]);

			$table->addColumn('password', 'string', [
				'notnull' => false,
				'default' => null,
			]);
			$table->addColumn('iv', 'string', [
				'notnull' => false,
				'default' => null,
			]);

			$table->addColumn('expired_at', 'datetime', [
				'notnull' => false,
			]);
			$table->addColumn('created_at', 'datetime', [
				'notnull' => false,
			]);
			$table->addColumn('updated_at', 'datetime', [
				'notnull' => false,
			]);

			$table->setPrimaryKey(['id']);
			$table->addIndex(['receiver_id'], 'otpmanager_receiver_id_index');
			$table->addUniqueIndex(['account_id', 'receiver_id'], 'otpmanager_shared_unique_index');
			$table->addForeignKeyConstraint(Application::ACCOUNTS_DB, ["account_id"], ["id"], ["onDelete" => "CASCADE"]);
		}

		return $schema;
	}
}
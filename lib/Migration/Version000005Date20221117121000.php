<?php

  namespace OCA\OtpManager\Migration;

  use Closure;
  use OCP\DB\ISchemaWrapper;
  use OCP\Migration\SimpleMigrationStep;
  use OCP\Migration\IOutput;
  use OCA\OtpManager\AppInfo\Application;

  class Version000005Date20221117121000 extends SimpleMigrationStep {

    /**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array $options
	 * @return null|ISchemaWrapper
	 */
	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options) {
		/** @var ISchemaWrapper $schema */
        $schema = $schemaClosure();

		if (!$schema->hasTable(Application::ACCOUNTS_DB)) {
			$table = $schema->createTable(Application::ACCOUNTS_DB);
			$table->addColumn('id', 'integer', [
				'autoincrement' => true,
				'notnull' => true,
			]);

            $table->addColumn('secret', 'string', [
				'notnull' => true,
				'length' => 200
			]);
            $table->addColumn('name', 'string', [
				'notnull' => true,
				'length' => 50
			]);
            $table->addColumn('issuer', 'string', [
				'notnull' => true,
				'length' => 50
			]);
            $table->addColumn('digits', 'integer', [
				'notnull' => true,
			]);
            $table->addColumn('type', 'string', [
				'notnull' => true,
				'length' => 4
			]);
            $table->addColumn('period', 'integer', [
				'notnull' => true,
			]);
            $table->addColumn('algorithm', 'integer', [
				'notnull' => true,
			]);

            // HOTP code
            $table->addColumn('counter', 'integer', [
				'notnull' => false,
			]);
            $table->addColumn('last_date_time', 'integer', [
				'notnull' => false,
			]);

			$table->addColumn('position', 'integer', [
				'notnull' => true,
			]);

			$table->addColumn('user_id', 'string', [
				'notnull' => true,
				'length' => 64,
			]);

			$table->setPrimaryKey(['id']);
            $table->addUniqueIndex(['secret'], 'otpmanager_secret_index');
			$table->addIndex(['user_id'], 'otpmanager_user_id_index');
		}
		
		return $schema;
	}
}

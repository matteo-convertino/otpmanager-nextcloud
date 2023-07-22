<?php

  namespace OCA\OtpManager\Migration;

  use Closure;
  use OCP\DB\ISchemaWrapper;
  use OCP\Migration\SimpleMigrationStep;
  use OCP\Migration\IOutput;
  use OCA\OtpManager\AppInfo\Application;

  class Version000006Date20230206153000 extends SimpleMigrationStep {
    /**
	 * @param IOutput $output
	 * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
	 * @param array $options
	 * @return null|ISchemaWrapper
	 */
	public function changeSchema(IOutput $output, Closure $schemaClosure, array $options) {
		/** @var ISchemaWrapper $schema */
        $schema = $schemaClosure();
		
		$table = $schema->getTable(Application::ACCOUNTS_DB);

		$table->addColumn('created_at', 'datetime', [
			'notnull' => false,
		]);
		$table->addColumn('updated_at', 'datetime', [
			'notnull' => false,
		]);
		$table->addColumn('deleted_at', 'datetime', [
			'notnull' => false,
		]);

		$positionCol = $table->getColumn("position");

		if ($positionCol->getNotnull()) {
			$positionCol->setNotnull(false);
		}
		
		return $schema;
	}
}

<?php

namespace OCA\OtpManager\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
use OCP\Migration\SimpleMigrationStep;
use OCP\Migration\IOutput;
use OCA\OtpManager\AppInfo\Application;

class Version000010Date20240123120000 extends SimpleMigrationStep
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
	
		$table = $schema->getTable(Application::ACCOUNTS_DB);

        $secretCol = $table->getColumn("secret");
        $nameCol = $table->getColumn("name");
        $issuerCol = $table->getColumn("issuer");
        $digitsCol = $table->getColumn("digits");
        $periodCol = $table->getColumn("period");

        $secretCol->setLength(512);
        $nameCol->setLength(256);
        $issuerCol->setLength(256);
        $digitsCol->setNotnull(false);
        $periodCol->setNotnull(false);

		return $schema;
	}
}
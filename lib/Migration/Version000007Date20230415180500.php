<?php

namespace OCA\OtpManager\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;

class Version000007Date20230415180500 extends SimpleMigrationStep
{
    /**
     * @param IOutput $output
     * @param Closure $schemaClosure The `\Closure` returns a `ISchemaWrapper`
     * @param array $options
     * @return null|ISchemaWrapper
     */
    public function changeSchema(IOutput $output, Closure $schemaClosure, array $options): ?ISchemaWrapper
    {
        /** @var ISchemaWrapper $schema */
        $schema = $schemaClosure();

        $table = $schema->getTable("otpmanager_accounts");

        $table->dropColumn('last_date_time');

        return $schema;
    }
}

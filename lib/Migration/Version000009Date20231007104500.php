<?php

namespace OCA\OtpManager\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;

class Version000009Date20231007104500 extends SimpleMigrationStep
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

        $table = $schema->getTable("otpmanager_settings");

        $table->addColumn('password', 'string', [
            'notnull' => false,
            'default' => null,
        ]);

        $table->addColumn('iv', 'string', [
            'notnull' => false,
            'default' => null,
        ]);

        return $schema;
    }
}

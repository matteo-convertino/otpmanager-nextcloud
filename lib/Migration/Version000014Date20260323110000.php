<?php

namespace OCA\OtpManager\Migration;

use Closure;
use OCP\DB\ISchemaWrapper;
use OCP\DB\Types;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;

class Version000014Date20260323110000 extends SimpleMigrationStep
{

    public function changeSchema(IOutput $output, Closure $schemaClosure, array $options): ISchemaWrapper
    {
        $schema = $schemaClosure();

        $table = $schema->getTable("otpmanager_settings");

        $table->addColumn('view_mode', Types::STRING, [
            'notnull' => true,
            'default' => 'table',
        ]);

        return $schema;
    }
}
<?php

namespace OCA\OtpManager\Migration;

use Closure;
use OCA\OtpManager\AppInfo\Application;
use OCP\DB\ISchemaWrapper;
use OCP\DB\Types;
use OCP\Migration\IOutput;
use OCP\Migration\SimpleMigrationStep;

class Version000015Date20260720190000 extends SimpleMigrationStep
{
    public function changeSchema(IOutput $output, Closure $schemaClosure, array $options): ISchemaWrapper
    {
        /** @var ISchemaWrapper $schema */
        $schema = $schemaClosure();

        if ($schema->hasTable(Application::SETTINGS_DB)) {
            $table = $schema->getTable(Application::SETTINGS_DB);

            if ($table->hasIndex('otpmanager_sett_user_id_index')) {
                $table->dropIndex('otpmanager_sett_user_id_index');
            }
        }

        return $schema;
    }
}
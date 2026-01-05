<?php

declare(strict_types=1);

namespace OCA\OtpManager\Db;

use OCA\OtpManager\AppInfo\Application;
use OCP\AppFramework\Db\QBMapper;
use OCP\AppFramework\OCS\OCSException;
use OCP\DB\Exception;
use OCP\IDBConnection;
use Throwable;

/**
 * @template-extends QBMapper<Setting>
 */
class SettingMapper extends QBMapper
{
    public function __construct(IDBConnection $db)
    {
        parent::__construct($db, Application::SETTINGS_DB, Setting::class);
    }

    /**
     * @param string $userId
     * @return Setting|null
     */
    public function find(string $userId): ?Setting
    {
        $qb = $this->db->getQueryBuilder();
        $qb->select('*')
            ->from($this->getTableName())
            ->where($qb->expr()->eq('user_id', $qb->createNamedParameter($userId)));

        try {
            $setting = $this->findEntity($qb);
        } catch (Throwable) {
            return null;
        }

        return $setting;
    }

    /**
     * @return array
     * @throws OCSException
     */
    public function findAll(): array
    {
        $qb = $this->db->getQueryBuilder();
        $qb->select('*')->from($this->getTableName());

        try {
            return $this->findEntities($qb);
        } catch (\Exception) {
            throw new OCSException("There was an error while fetching all settings", 500);
        }
    }
}

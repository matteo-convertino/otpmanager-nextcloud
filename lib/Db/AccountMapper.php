<?php

declare(strict_types=1);

namespace OCA\OtpManager\Db;

use OCA\OtpManager\AppInfo\Application;
use OCA\OtpManager\Utils\AccountPositionHelper;
use OCP\AppFramework\Db\QBMapper;
use OCP\DB\Exception;
use OCP\IDBConnection;
use Throwable;

/**
 * @template-extends QBMapper<Account>
 */
class AccountMapper extends QBMapper
{
    public function __construct(IDBConnection $db)
    {
        parent::__construct($db, Application::ACCOUNTS_DB, Account::class);
    }

    public function find(string $column, string|int $value, string $userId): ?Account
    {
        $qb = $this->db->getQueryBuilder();
        $qb->select('*')
            ->from($this->getTableName())
            ->where($qb->expr()->eq($column, $qb->createNamedParameter($value)))
            ->andWhere($qb->expr()->eq('user_id', $qb->createNamedParameter($userId)));

        try {
            $account = $this->findEntity($qb);
        } catch (Throwable) {
            $account = null;
        }

        return $account;
    }

    /**
     * @param string $userId
     * @return array
     * @throws Exception
     */
    public function findAllByUser(string $userId): array
    {
        $qb = $this->db->getQueryBuilder();
        $qb->select('*')
            ->from($this->getTableName())
            ->where($qb->expr()->isNull('deleted_at'))
            ->andWhere($qb->expr()->eq('user_id', $qb->createNamedParameter($userId)))
            ->orderBy("position", "desc");

        return $this->findEntities($qb);
    }

    /**
     * @param string $userId
     * @return int
     */
    public function findMaxPosition(string $userId): int
    {
        $qb = $this->db->getQueryBuilder();
        $qb->selectAlias($qb->func()->max("position"), "position")
            ->from($this->getTableName())
            ->where($qb->expr()->isNull('deleted_at'))
            ->andWhere($qb->expr()->eq('user_id', $qb->createNamedParameter($userId)));

        try {
            $account = $this->findEntity($qb);
            $position = $account->getPosition();

            $position = is_null($position) ? -1 : $position;
        } catch (Throwable) {
            $position = -1;
        }

        return $position;
    }

    /**
     * @param string $userId
     * @return array
     * @throws Exception
     */
    public function findAllWithDeleted(string $userId): array
    {
        $qb = $this->db->getQueryBuilder();
        $qb->select('*')
            ->from($this->getTableName())
            ->where($qb->expr()->eq('user_id', $qb->createNamedParameter($userId)))
            ->orderBy("position", "desc");
        return $this->findEntities($qb);
    }

    /**
     * @param int $pos
     * @param string $userId
     * @return array
     * @throws Exception
     */
    public function findAllPosGtThan(int $pos, string $userId): array
    {
        $qb = $this->db->getQueryBuilder();
        $qb->select('*')
            ->from($this->getTableName())
            ->where($qb->expr()->gt("position", $qb->createNamedParameter($pos)))
            ->andWhere($qb->expr()->eq('user_id', $qb->createNamedParameter($userId)));
        return $this->findEntities($qb);
    }

    /*public function destroy(int $accountId, string $userId): ?Account
    {
        $account = $this->find("id", $accountId, $userId);

        if ($account != null) {
            try {
                $account = $this->delete($account);
            } catch (Throwable) {
                $account = null;
            }
        }

        return $account;
    }*/

    /**
     * @throws Exception
     */
    public function safeDelete(Account $account): void
    {
        AccountPositionHelper::decreasePosition($this, $this->findAllPosGtThan($account->getPosition(), $account->getUserId()));

        $account->setDeletedAt(date("Y-m-d H:i:s"));
        $account->setPosition(null);
        $this->update($account);
    }
}

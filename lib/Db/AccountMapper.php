<?php

declare(strict_types=1);

namespace OCA\OtpManager\Db;

use OCA\OtpManager\AppInfo\Application;
use OCA\OtpManager\Utils\AccountPositionHelper;
use OCP\AppFramework\Db\Entity;
use OCP\AppFramework\Db\QBMapper;
use OCP\AppFramework\OCS\OCSException;
use OCP\DB\Exception;
use OCP\DB\QueryBuilder\IQueryBuilder;
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

    /**
     * @param IQueryBuilder $query
     * @return Account[]
     * @throws OCSException
     */
    protected function findEntities(IQueryBuilder $query): array
    {
        try {
            return parent::findEntities($query);
        } catch (\Exception) {
            throw new OCSException("There was an error while finding accounts", 500);
        }
    }

    /**
     * @param Account $entity
     * @return Account
     * @throws OCSException
     */
    public function insert(Entity $entity): Entity
    {
        try {
            return parent::insert($entity);
        } catch (\Exception) {
            throw new OCSException("There was an error while inserting account with id:" . $entity->getId(), 500);
        }
    }

    /**
     * @param Account $entity
     * @return Account
     * @throws OCSException
     */
    public function update(Entity $entity): Entity
    {
        try {
            return parent::update($entity);
        } catch (\Exception) {
            throw new OCSException("There was an error while updating account with id:" . $entity->getId(), 500);
        }
    }

    /**
     * @param string $column
     * @param string|int $value
     * @param string $userId
     * @return Account|null
     */
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
     * @throws OCSException
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
     * @return array
     * @throws OCSException
     */
    public function findAllDeletedByUser(string $userId): array
    {
        $qb = $this->db->getQueryBuilder();
        $qb->select('*')
            ->from($this->getTableName())
            ->where($qb->expr()->isNotNull('deleted_at'))
            ->andWhere($qb->expr()->eq('user_id', $qb->createNamedParameter($userId)));

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
     * @throws OCSException
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
     * @throws OCSException
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

    /**
     * @param Account $account
     * @return Account
     * @throws OCSException
     */
    public function destroy(Account $account): Account
    {
        try {
            return $this->delete($account);
        } catch (Throwable) {
            throw new OCSException("There was an error while deleting account with id:" . $account->getId(), 500);
        }
    }

    /**
     * @param Account $account
     * @return void
     * @throws OCSException
     */
    public function safeDelete(Account $account): void
    {
        AccountPositionHelper::decreasePosition(
            mapper: $this,
            accounts: $this->findAllPosGtThan($account->getPosition(), $account->getUserId())
        );

        $account->setDeletedAt(date("Y-m-d H:i:s"));
        $account->setPosition(null);

        $this->update($account);
    }
}

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
 * @template-extends QBMapper<SharedAccount>
 */
class SharedAccountMapper extends QBMapper
{
    private AccountMapper $accountMapper;

    public function __construct(IDBConnection $db, AccountMapper $accountMapper)
    {
        parent::__construct($db, Application::SHARED_ACCOUNTS_DB, SharedAccount::class);

        $this->accountMapper = $accountMapper;
    }

    /**
     * @param IQueryBuilder $query
     * @return SharedAccount[]
     * @throws OCSException
     */
    protected function findEntities(IQueryBuilder $query): array
    {
        try {
            return parent::findEntities($query);
        } catch (\Exception) {
            throw new OCSException("There was an error while finding shared accounts" , 500);
        }
    }

    /**
     * @param SharedAccount $entity
     * @return SharedAccount
     * @throws OCSException
     */
    public function insert(Entity $entity): Entity
    {
        try {
            return parent::insert($entity);
        } catch (\Exception) {
            throw new OCSException("There was an error while inserting shared account with id:" . $entity->getId(), 500);
        }
    }

    /**
     * @param SharedAccount $entity
     * @return SharedAccount
     * @throws OCSException
     */
    public function update(Entity $entity): Entity
    {
        try {
            return parent::update($entity);
        } catch (\Exception) {
            throw new OCSException("There was an error while updating shared account with id:" . $entity->getId(), 500);
        }
    }

    /**
     * @param SharedAccount $entity
     * @return SharedAccount
     * @throws OCSException
     */
    public function delete(Entity $entity): Entity
    {
        try {
            return parent::delete($entity);
        } catch (\Exception) {
            throw new OCSException("There was an error while deleting shared account with id:" . $entity->getId(), 500);
        }
    }


    /**
     * @param int $accountId
     * @param string $userId
     * @return SharedAccount[]
     * @throws OCSException
     */
    public function findAllByAccountAndUserId(int $accountId, string $userId): array
    {
        $qb = $this->db->getQueryBuilder();
        $qb->select('shared_accounts.*')
            ->from($this->getTableName(), "shared_accounts")
            ->innerJoin('shared_accounts', Application::ACCOUNTS_DB, "accounts", "shared_accounts.account_id = accounts.id")
            ->where($qb->expr()->eq("account_id", $qb->createNamedParameter($accountId)))
            ->andWhere($qb->expr()->eq("accounts.user_id", $qb->createNamedParameter($userId)))
            ->andWhere(
                $qb->expr()->orX(
                    $qb->expr()->isNull('expired_at'),
                    $qb->expr()->gte('expired_at', $qb->createNamedParameter(date('Y-m-d'))),
                )
            );


        return $this->findEntities($qb);
    }

    /**
     * @param string $column
     * @param string|int $value
     * @param string $receiverId
     * @return SharedAccount|null
     */
    public function find(string $column, string|int $value, string $receiverId): ?SharedAccount
    {
        $qb = $this->db->getQueryBuilder();
        $qb->select('*')
            ->from($this->getTableName())
            ->where($qb->expr()->eq($column, $qb->createNamedParameter($value)))
            ->andWhere($qb->expr()->eq('receiver_id', $qb->createNamedParameter($receiverId)))
            ->andWhere(
                $qb->expr()->orX(
                    $qb->expr()->isNull('expired_at'),
                    $qb->expr()->gte('expired_at', $qb->createNamedParameter(date('Y-m-d'))),
                )
            );

        try {
            $sharedAccount = $this->findEntity($qb);
        } catch (Throwable) {
            $sharedAccount = null;
        }

        return $sharedAccount;
    }

    /**
     * @param int $accountId
     * @param string $receiverId
     * @return SharedAccount|null
     */
    public function findByReceiver(int $accountId, string $receiverId): ?SharedAccount
    {
        $qb = $this->db->getQueryBuilder();
        $qb->select('*')
            ->from($this->getTableName())
            ->where($qb->expr()->eq("account_id", $qb->createNamedParameter($accountId)))
            ->andWhere($qb->expr()->eq('receiver_id', $qb->createNamedParameter($receiverId)))
            ->andWhere(
                $qb->expr()->orX(
                    $qb->expr()->isNull('expired_at'),
                    $qb->expr()->gte('expired_at', $qb->createNamedParameter(date('Y-m-d'))),
                )
            );

        try {
            $sharedAccount = $this->findEntity($qb);
        } catch (Throwable) {
            $sharedAccount = null;
        }

        return $sharedAccount;
    }

    /**
     * @param string $receiverId
     * @return SharedAccount[]
     * @throws OCSException
     */
    public function findAllByReceiver(string $receiverId): array
    {
        $qb = $this->db->getQueryBuilder();
        $qb->select('*')
            ->from($this->getTableName())
            ->where($qb->expr()->eq('receiver_id', $qb->createNamedParameter($receiverId)))
            ->andWhere(
                $qb->expr()->orX(
                    $qb->expr()->isNull('expired_at'),
                    $qb->expr()->gte('expired_at', $qb->createNamedParameter(date('Y-m-d'))),
                )
            );

        return $this->findEntities($qb);
    }

    /**
     * @param string $receiverId
     * @return array
     * @throws OCSException
     */
    public function findAllByReceiverJoin(string $receiverId): array
    {
        $qb = $this->db->getQueryBuilder();

        $qb->select(
            "shared_accounts.*",
            "accounts.period",
            "accounts.digits",
            "accounts.type",
            "accounts.algorithm",
            "accounts.counter",
            "accounts.user_id"
        )
            ->from($this->getTableName(), "shared_accounts")
            ->innerJoin('shared_accounts', Application::ACCOUNTS_DB, "accounts", "shared_accounts.account_id = accounts.id")
            ->where($qb->expr()->eq('receiver_id', $qb->createNamedParameter($receiverId)))
            ->andWhere(
                $qb->expr()->orX(
                    $qb->expr()->isNull('expired_at'),
                    $qb->expr()->gte('expired_at', $qb->createNamedParameter(date('Y-m-d'))),
                )
            );

        try {
            $result = $qb->executeQuery();
        } catch (\Exception) {
            throw new OCSException("There was an error while fetching all detailed shared accounts by receiver", 500);
        }

        $rows = $result->fetchAll();
        $result->closeCursor();

        return $rows;
    }

    /**
     * @param string $accountId
     * @return SharedAccount[]
     * @throws OCSException
     */
    public function findAllByAccount(string $accountId): array
    {
        $qb = $this->db->getQueryBuilder();
        $qb->select('*')
            ->from($this->getTableName())
            ->where($qb->expr()->eq('account_id', $qb->createNamedParameter($accountId)))
            ->andWhere(
                $qb->expr()->orX(
                    $qb->expr()->isNull('expired_at'),
                    $qb->expr()->gte('expired_at', $qb->createNamedParameter(date('Y-m-d'))),
                )
            );

        return $this->findEntities($qb);
    }

    /**
     * @param string $accountId
     * @return string[]
     * @throws OCSException
     */
    public function findUsersAlreadyShared(string $accountId): array
    {
        $qb = $this->db->getQueryBuilder();
        $qb->select("receiver_id")
            ->from($this->getTableName())
            ->where($qb->expr()->eq('account_id', $qb->createNamedParameter($accountId)))
            ->andWhere(
                $qb->expr()->orX(
                    $qb->expr()->isNull('expired_at'),
                    $qb->expr()->gte('expired_at', $qb->createNamedParameter(date('Y-m-d'))),
                )
            );

        try {
            $result = $qb->executeQuery();
        } catch (\Exception) {
            throw new OCSException("There was an error while fetching all nextcloud users the account is shared with", 500);
        }

        $row = $result->fetchAll();
        $result->closeCursor();

        return array_map(fn($r) => $r['receiver_id'], $row);
    }

    /**
     * @param string $userId
     * @param string $accountId
     * @return array
     * @throws OCSException
     */
    public function findUsers(string $userId, string $accountId): array
    {
        $qb = $this->db->getQueryBuilder();

        $qb->select('uid', 'displayname')
            ->from("users")
            ->where($qb->expr()->neq('uid', $qb->createNamedParameter($userId)));

        $usersAlreadyShared = $this->findUsersAlreadyShared($accountId);

        if (count($usersAlreadyShared) > 0)
            $qb->andWhere($qb->expr()->notIn('uid', $qb->createNamedParameter($usersAlreadyShared)));

        try {
            $result = $qb->executeQuery();
        } catch (\Exception) {
            throw new OCSException("There was an error while fetching all nextcloud users", 500);
        }

        $rows = $result->fetchAll();
        $result->closeCursor();

        return $rows;
    }

    /**
     * @param int $pos
     * @param string $receiverId
     * @return SharedAccount[]
     * @throws OCSException
     */
    public function findAllPosGtThan(int $pos, string $receiverId): array
    {
        $qb = $this->db->getQueryBuilder();
        $qb->select('*')
            ->from($this->getTableName())
            ->where($qb->expr()->gt("position", $qb->createNamedParameter($pos)))
            ->andWhere($qb->expr()->eq('receiver_id', $qb->createNamedParameter($receiverId)))
            ->andWhere(
                $qb->expr()->orX(
                    $qb->expr()->isNull('expired_at'),
                    $qb->expr()->gte('expired_at', $qb->createNamedParameter(date('Y-m-d'))),
                )
            );

        return $this->findEntities($qb);
    }

    /**
     * @param string $receiverId
     * @param string $secret
     * @return Account|null
     */
    public function findAccountBySecret(string $receiverId, string $secret): ?Account
    {
        $qb = $this->db->getQueryBuilder();

        $qb->select('accounts.*')
            ->from($this->getTableName(), "shared_accounts")
            ->innerJoin('shared_accounts', Application::ACCOUNTS_DB, "accounts", "shared_accounts.account_id = accounts.id")
            ->where($qb->expr()->eq("shared_accounts.secret", $qb->createNamedParameter($secret)))
            ->andWhere($qb->expr()->eq("shared_accounts.receiver_id", $qb->createNamedParameter($receiverId)))
            ->andWhere(
                $qb->expr()->orX(
                    $qb->expr()->isNull('expired_at'),
                    $qb->expr()->gte('expired_at', $qb->createNamedParameter(date('Y-m-d'))),
                )
            );

        try {
            $account = $this->accountMapper->findEntity($qb);
        } catch (Throwable) {
            $account = null;
        }

        return $account;
    }

    /**
     * @param Account $account
     * @return void
     * @throws OCSException
     */
    public function destroy(Account $account): void
    {
        $sharedAccountsGtPos = $this->findAllPosGtThan($account->getPosition(), $account->getUserId());

        foreach ($sharedAccountsGtPos as $a) {
            $a->setPosition($a->getPosition() - 1);
            $this->update($a);
        }

        $sharedAccounts = $this->findAllByAccountAndUserId($account->getId(), $account->getUserId());

        // loop users it was shared with
        foreach ($sharedAccounts as $sharedAccount) {
            AccountPositionHelper::decreasePosition(
                mapper: $this,
                accounts: $this->findAllPosGtThan($sharedAccount->getPosition(), $sharedAccount->getReceiverId())
            );
            AccountPositionHelper::decreasePosition(
                mapper: $this->accountMapper,
                accounts: $this->accountMapper->findAllPosGtThan($sharedAccount->getPosition(), $sharedAccount->getReceiverId())
            );

            $this->delete($sharedAccount);
        }
    }

    /**
     * @param int $accountId
     * @param string $receiverId
     * @return bool
     * @throws OCSException
     */
    public function unshare(int $accountId, string $receiverId): bool
    {
        $sharedAccount = $this->find("account_id", $accountId, $receiverId);

        if ($sharedAccount == null) {
            return false;
        } else {
            AccountPositionHelper::decreasePosition(
                mapper: $this,
                accounts: $this->findAllPosGtThan($sharedAccount->getPosition(), $receiverId)
            );
            AccountPositionHelper::decreasePosition(
                mapper: $this->accountMapper,
                accounts: $this->accountMapper->findAllPosGtThan($sharedAccount->getPosition(), $receiverId)
            );

            $this->delete($sharedAccount);

            return true;
        }
    }

    /**
     * @param string $receiverId
     * @return int
     */
    public function findMaxPosition(string $receiverId): int
    {
        $qb = $this->db->getQueryBuilder();
        $qb->selectAlias($qb->func()->max("position"), "position")
            ->from(Application::SHARED_ACCOUNTS_DB)
            ->where($qb->expr()->eq('receiver_id', $qb->createNamedParameter($receiverId)))
            ->andWhere(
                $qb->expr()->orX(
                    $qb->expr()->isNull('expired_at'),
                    $qb->expr()->gte('expired_at', $qb->createNamedParameter(date('Y-m-d'))),
                )
            );

        try {
            $sharedAccount = $this->findEntity($qb);
            $position = $sharedAccount->getPosition();

            $position = is_null($position) ? -1 : $position;
        } catch (Throwable) {
            $position = -1;
        }

        return $position;
    }
}
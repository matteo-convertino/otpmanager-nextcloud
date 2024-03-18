<?php
declare(strict_types=1);
// SPDX-FileCopyrightText: Matteo Convertino <matteo@convertino.cloud>
// SPDX-License-Identifier: AGPL-3.0-or-later

namespace OCA\OtpManager\Db;

use OCP\AppFramework\Db\DoesNotExistException;
use OCP\AppFramework\Db\QBMapper;
use OCP\IDBConnection;
use OCA\OtpManager\AppInfo\Application;
use Throwable;
use OCP\IConfig;
use OCP\ILogger;

/**
 * @template-extends QBMapper<SharedAccount>
 */
class SharedAccountMapper extends QBMapper {
	private ILogger $logger;
	private AccountMapper $accountMapper;

	public function __construct(IDBConnection $db, ILogger $logger, AccountMapper $accountMapper) {
		parent::__construct($db, Application::SHARED_ACCOUNTS_DB, SharedAccount::class);
		
		$this->logger = $logger;
		$this->accountMapper = $accountMapper;
	}

	public function findAllByAccountAndUserId(int $accountId, string $userId): array {
		$qb = $this->db->getQueryBuilder();
		$qb->select('sharedAccounts.*')
			->from($this->getTableName(), "sharedAccounts")
			->innerJoin('sharedAccounts', Application::ACCOUNTS_DB, "accounts", "sharedAccounts.account_id = accounts.id")
			->where($qb->expr()->eq("account_id", $qb->createNamedParameter($accountId)))
			->andWhere($qb->expr()->eq("accounts.user_id", $qb->createNamedParameter($userId)))
			->andWhere(
				$qb->expr()->orX(
					$qb->expr()->isNull('expired_at'),
					$qb->expr()->gte('expired_at', date('Y-m-d')),
				)
			);
		
		return $this->findEntities($qb);
	}

	public function find(string $column, string|int $value, string $receiverId): ?SharedAccount
	{
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')
			->from($this->getTableName())
			->where($qb->expr()->eq($column, $qb->createNamedParameter($value)))
			->andWhere($qb->expr()->eq('receiver_id', $qb->createNamedParameter($receiverId)));
		
		try {
			$sharedAccount = $this->findEntity($qb);
		} catch (Throwable) {
			$sharedAccount = null;
		}

		return $sharedAccount;
	}

	public function findByReceiver(int $accountId, string $receiverId): ?SharedAccount
	{
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')
			->from($this->getTableName())
			->where($qb->expr()->eq("account_id", $qb->createNamedParameter($accountId)))
			->andWhere($qb->expr()->eq('receiver_id', $qb->createNamedParameter($receiverId)));

		try {
			$sharedAccount = $this->findEntity($qb);
		} catch (Throwable) {
			$sharedAccount = null;
		}

		return $sharedAccount;
	}

    /**
	 * @param string $userId
	 * @return array
	 */
	public function findAllByReceiver(string $userId): array
	{
		$qb = $this->db->getQueryBuilder();

		$qb->select("sharedAccounts.*",
			"accounts.period",
			"accounts.digits",
			"accounts.type",
			"accounts.algorithm",
			"accounts.counter",
			"accounts.user_id")
			->from($this->getTableName(), "sharedAccounts")
			->innerJoin('sharedAccounts', Application::ACCOUNTS_DB, "accounts", "sharedAccounts.account_id = accounts.id")
			->where($qb->expr()->eq('receiver_id', $qb->createNamedParameter($userId)));

		$result = $qb->executeQuery();
		$rows = $result->fetchAll();
		$result->closeCursor();
	
		return $rows;
	}


    /**
	 * @param string $accountId
	 * @return array
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
					$qb->expr()->gte('expired_at', date('Y-m-d')),
				)
			);

		return $this->findEntities($qb);
	}

	 /**
	 * @param string $accountId
	 * @return array
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
					$qb->expr()->gte('expired_at', date('Y-m-d')),
				)
			);
		
		$result = $qb->executeQuery();
		$row = $result->fetchAll();
		$result->closeCursor();

		return array_map(fn($r) => $r['receiver_id'], $row);
	}

	public function findUsers(string $userId, string $accountId): array
	{
		$qb = $this->db->getQueryBuilder();
		$qb->select('uid', 'displayname')
			->from("users")
			->where($qb->expr()->neq('uid', $qb->createNamedParameter($userId)))
			->andWhere($qb->expr()->notIn('uid', $this->findUsersAlreadyShared($accountId)));

		$result = $qb->executeQuery();
		$rows = $result->fetchAll();
		$result->closeCursor();

		return $rows;
	}

	public function findAllPosGtThan(int $pos, string $receiverId): array
	{
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')
			->from($this->getTableName())
			->where($qb->expr()->gt("position", $qb->createNamedParameter($pos)))
			->andWhere($qb->expr()->eq('receiver_id', $qb->createNamedParameter($receiverId)));
		return $this->findEntities($qb);
	}

	public function findAccountBySecret(string $receiverId, string $secret): ?Account {
		$qb = $this->db->getQueryBuilder();

		$qb->select('accounts.*')
			->from($this->getTableName(), "sharedAccounts")
			->innerJoin('sharedAccounts', Application::ACCOUNTS_DB, "accounts", "sharedAccounts.account_id = accounts.id")
			->where($qb->expr()->eq("sharedAccounts.secret", $qb->createNamedParameter($secret)))
			->andWhere($qb->expr()->eq("sharedAccounts.receiver_id", $qb->createNamedParameter($receiverId)))
			->andWhere(
				$qb->expr()->orX(
					$qb->expr()->isNull('expired_at'),
					$qb->expr()->gte('expired_at', date('Y-m-d')),
				)
			);
		
			try {
				$account = $this->accountMapper->findEntity($qb);
			} catch (Throwable) {
				$account = null;
			}
	
			return $account;
	}

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
			// decrease by 1 the position of all shared accounts after it
			$sharedAccountsGtPos = $this->findAllPosGtThan($sharedAccount->getPosition(), $sharedAccount->getReceiverId());

			foreach ($sharedAccountsGtPos as $a) {
				$a->setPosition($a->getPosition() - 1);
				$this->update($a);
			}

			// decrease by 1 the position of all accounts after it
			$accountsGtPos = $this->accountMapper->findAllAccountsPosGtThan($sharedAccount->getPosition(), $sharedAccount->getReceiverId());

			foreach ($accountsGtPos as $a) {
				$a->setPosition($a->getPosition() - 1);
				$this->accountMapper->update($a);
			}
			
			$this->delete($sharedAccount);
		}
	}


	public function unshare(int $accountId, string $receiverId): bool {
		$sharedAccount = $this->find("account_id", $accountId, $receiverId);

		if($sharedAccount == null) {
			return false;
		} else {
			// decrease by 1 the position of all shared accounts after it
			$sharedAccountsGtPos = $this->findAllPosGtThan($sharedAccount->getPosition(), $receiverId);

			foreach ($sharedAccountsGtPos as $a) {
				$a->setPosition($a->getPosition() - 1);
				$this->update($a);
			}

			// decrease by 1 the position of all accounts after it
			$accountsGtPos = $this->accountMapper->findAllAccountsPosGtThan($sharedAccount->getPosition(), $receiverId);

			foreach ($accountsGtPos as $a) {
				$a->setPosition($a->getPosition() - 1);
				$this->accountMapper->update($a);
			}
			
			$this->delete($sharedAccount);

			return true;
		}
	}

	public function findMaxPosition(string $receiverId): int {
		$qb = $this->db->getQueryBuilder();
		$qb->selectAlias($qb->func()->max("position"), "position")
			->from(Application::SHARED_ACCOUNTS_DB)
			->where($qb->expr()->eq('receiver_id', $qb->createNamedParameter($receiverId)))
			->andWhere(
				$qb->expr()->orX(
					$qb->expr()->isNull('expired_at'),
					$qb->expr()->gte('expired_at', date('Y-m-d')),
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

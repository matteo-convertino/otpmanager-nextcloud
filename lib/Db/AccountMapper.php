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
use \OCP\ILogger;

/**
 * @template-extends QBMapper<Account>
 */
class AccountMapper extends QBMapper
{
	private ILogger $logger;

	public function __construct(IDBConnection $db, ILogger $logger)
	{
		parent::__construct($db, Application::ACCOUNTS_DB, Account::class);

		$this->logger = $logger;
	}

	/**
	 * @throws \OCP\AppFramework\Db\MultipleObjectsReturnedException
	 * @throws DoesNotExistException
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
	 * @return array
	 */
	public function findAll(): array
	{
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')->from($this->getTableName());
		return $this->findEntities($qb);
	}

	public function findAllAccountsPosGtThan(int $pos, string $userId): array
	{
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')
			->from($this->getTableName())
			->where($qb->expr()->gt("position", $qb->createNamedParameter($pos)))
			->andWhere($qb->expr()->eq('user_id', $qb->createNamedParameter($userId)));
		return $this->findEntities($qb);
	}

	public function findAllAccountsPosGteThan(int $pos, string $userId): array
	{
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')
			->from($this->getTableName())
			->where($qb->expr()->gte("position", $qb->createNamedParameter($pos)))
			->andWhere($qb->expr()->eq('user_id', $qb->createNamedParameter($userId)));
		return $this->findEntities($qb);
	}

	public function destroy(int $accountId, string $userId): ?Account
	{
		$account = $this->find("id", $accountId, $userId);

		if($account != null) {
			try {
				$account = $this->delete($account);
			} catch (Throwable) {
				$account = null;
			}	
		}
		
		return $account;
	}

	public function safeDelete(Account $account): void {
		// decrease by 1 the position of all accounts after it
		$accountsGreaterPos = $this->findAllAccountsPosGtThan($account->getPosition(), $account->getUserId());

		foreach ($accountsGreaterPos as $a) {
			$a->setPosition($a->getPosition() - 1);
			$this->update($a);
		}

		$account->setDeletedAt(date("Y-m-d H:i:s"));
		$account->setPosition(null);
		$this->update($account);
	}
}

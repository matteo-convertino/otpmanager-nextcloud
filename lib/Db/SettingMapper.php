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

/**
 * @template-extends QBMapper<Account>
 */
class SettingMapper extends QBMapper {
	public function __construct(IDBConnection $db) {
		parent::__construct($db, Application::SETTINGS_DB, Setting::class);
	}

	/**
	 * @throws \OCP\AppFramework\Db\MultipleObjectsReturnedException
	 * @throws DoesNotExistException
	 */
	public function find(string $userId): Setting {
		/* @var $qb IQueryBuilder */
		$qb = $this->db->getQueryBuilder();
		$qb->select('*')
			->from($this->getTableName())
			->where($qb->expr()->eq('user_id', $qb->createNamedParameter($userId)));
		
		try {
			$setting = $this->findEntity($qb);
		} catch (Throwable) {
            $setting = new Setting();
            $setting->setShowCodes(false);
            $setting->setDarkMode(true);
            $setting->setRecordsPerPage("10");
            $setting->setUserId($userId);
            $this->insert($setting);
		}
		
		return $setting;
	}

	/**
	 * @param string $userId
	 * @return array
	 */
	/*public function findAll(string $userId): array {
		/* @var $qb IQueryBuilder */
	/*	$qb = $this->db->getQueryBuilder();
		$qb->select('*')
			->from($this->getTableName())
			->where($qb->expr()->isNull('deleted_at'))
			->andWhere($qb->expr()->eq('user_id', $qb->createNamedParameter($userId)))
			->orderBy("position", "desc");
		return $this->findEntities($qb);
	}*/


}

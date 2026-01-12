<?php

declare(strict_types=1);

namespace OCA\OtpManager\Utils;

use OCA\OtpManager\Db\Account;
use OCA\OtpManager\Db\AccountMapper;
use OCA\OtpManager\Db\SharedAccount;
use OCA\OtpManager\Db\SharedAccountMapper;
use OCP\AppFramework\OCS\OCSException;

class AccountPositionHelper
{
    /**
     * Decrease by 1 the position of all accounts after it
     *
     * @param AccountMapper|SharedAccountMapper $mapper
     * @param Account[] | SharedAccount[] $accounts
     * @return Account[] | SharedAccount[]
     * @throws OCSException
     */
    static public function decreasePosition(AccountMapper|SharedAccountMapper $mapper, array $accounts): array
    {
        foreach ($accounts as $a) {
            $a->setPosition($a->getPosition() - 1);
            try {
                $mapper->update($a);
            } catch (\Exception) {
                throw new OCSException("There was an error while decreasing account's position with id: " . $a->getId(), 500);
            }
        }

        return $accounts;
    }

    /**
     * Increments by 1 the position of all those accounts
     * that above (>) the position of where I want to add the new account
     *
     * @param AccountMapper|SharedAccountMapper $mapper
     * @param Account[] | SharedAccount[] $accounts
     * @param int $pos
     * @return Account[] | SharedAccount[]
     * @throws OCSException
     */
    static public function increasePosition(AccountMapper|SharedAccountMapper $mapper, array $accounts, int $pos): array
    {
        foreach ($accounts as $accountGtePos) {
            $accountGtePos->setPosition(++$pos);
            try {
                $mapper->update($accountGtePos);
            } catch (\Exception) {
                throw new OCSException("There was an error while increasing account's position with id: " . $accountGtePos->getId(), 500);
            }
        }

        return $accounts;
    }
}

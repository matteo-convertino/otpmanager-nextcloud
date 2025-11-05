<?php

declare(strict_types=1);

namespace OCA\OtpManager\Utils;

use OCA\OtpManager\Db\AccountMapper;
use OCA\OtpManager\Db\SharedAccountMapper;
use OCP\DB\Exception;

class AccountPositionHelper
{
    /**
     * decrease by 1 the position of all accounts after it
     * @throws Exception
     */
    static public function decreasePosition(AccountMapper|SharedAccountMapper $mapper, array $accounts): array
    {
        foreach ($accounts as $a) {
            $a->setPosition($a->getPosition() - 1);
            $mapper->update($a);
        }

        return $accounts;
    }

    /**
     * increments by 1 the position of all those accounts
     * that above (>) the position of where I want to add the new account
     * @throws Exception
     */
    static public function increasePosition(AccountMapper|SharedAccountMapper $mapper, array $accounts, int $pos): array
    {
        foreach ($accounts as $accountGtePos) {
            $accountGtePos->setPosition(++$pos);
            $mapper->update($accountGtePos);
        }

        return $accounts;
    }
}

<?php

declare(strict_types=1);

namespace OCA\OtpManager\Controller;

use OCA\OtpManager\Controller\Validator\AccountForm;
use OCA\OtpManager\Db\Account;
use OCA\OtpManager\Db\AccountMapper;
use OCA\OtpManager\Db\SharedAccountMapper;
use OCA\OtpManager\Utils\Encryption;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\JSONResponse;
use OCP\DB\Exception;
use OCP\IRequest;

class AccountController extends Controller
{
    private AccountMapper $accountMapper;
    private SharedAccountMapper $sharedAccountMapper;
    private Encryption $encryption;
    private ?string $userId;

    public function __construct(
        string              $AppName,
        IRequest            $request,
        AccountMapper       $accountMapper,
        SharedAccountMapper $sharedAccountMapper,
        Encryption          $encryption,
        ?string             $UserId = null
    )
    {
        parent::__construct($AppName, $request);
        $this->accountMapper = $accountMapper;
        $this->sharedAccountMapper = $sharedAccountMapper;
        $this->encryption = $encryption;
        $this->userId = $UserId;
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function get($id): ?Account
    {
        return $this->accountMapper->find("id", $id, $this->userId);
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function getAll(): array
    {
        $accounts = $this->accountMapper->findAllByUser($this->userId);
        $sharedAccounts = $this->sharedAccountMapper->findAllByReceiverJoin($this->userId);

        $data = [
            "accounts" => $accounts,
            "shared_accounts" => $sharedAccounts,
        ];

        return $data;
    }

    private function convertAlgorithmToInt($algorithm): int
    {
        if ($algorithm == "SHA1") {
            return 0;
        } else if ($algorithm == "SHA256") {
            return 1;
        } else if ($algorithm == "SHA512") {
            return 2;
        }

        return $algorithm;
    }

    /**
     * @NoAdminRequired
     * @throws Exception
     */
    public function create(string $name, string $issuer, string $secret, string $type, int $period, string $algorithm, int $digits, ?int $counter): JSONResponse
    {
        $errors = AccountForm::validate($name, $issuer, $secret, $type, $period, $algorithm, $digits);

        if (count($errors) > 0) {
            return new JSONResponse($errors);
        }

        $algorithm = $this->convertAlgorithmToInt($algorithm);

        $account = $this->accountMapper->find("secret", $secret, $this->userId);

        if ($account != null && $account->getDeletedAt() == null) {
            $errors["secret"] = "This secret key already exists";
            return new JSONResponse($errors);
        }

        $maxSharedAccountPos = $this->sharedAccountMapper->findMaxPosition($this->userId);
        $maxAccountPos = $this->accountMapper->findMaxPosition($this->userId);

        $position = max($maxSharedAccountPos, $maxAccountPos) + 1;

        if ($account == null) {
            $account = new Account();

            $account->setSecret($secret);
            $account->setName($name);
            $account->setIssuer($issuer);
            $account->setDigits($digits);
            $account->setType($type);
            $account->setPeriod($period);
            $account->setAlgorithm($algorithm);
            $account->setCounter($type == "totp" ? null : -1);
            $account->setPosition($position);
            $account->setUserId($this->userId);
            $account->setCreatedAt(date("Y-m-d H:i:s"));
            $account->setUpdatedAt(date("Y-m-d H:i:s"));

            $this->accountMapper->insert($account);
        } else {
            $account->setName($name);
            $account->setIssuer($issuer);
            $account->setDigits($digits);
            $account->setType($type);
            $account->setPeriod($period);
            $account->setAlgorithm($algorithm);
            $account->setCounter($counter);
            $account->setPosition($position);
            $account->setDeletedAt(null);
            $account->setUpdatedAt(date("Y-m-d H:i:s"));

            $this->accountMapper->update($account);
        }

        return new JSONResponse($account);
    }

    /**
     * @NoAdminRequired
     */
    public function update(string $name, string $issuer, string $secret, string $type, int $period, string $algorithm, int $digits): array|string
    {
        $errors = AccountForm::validate($name, $issuer, null, $type, $period, $algorithm, $digits);

        if (count($errors) > 0) {
            return $errors;
        } else {
            $algorithm = $this->convertAlgorithmToInt($algorithm);

            $account = $this->accountMapper->find("secret", $secret, $this->userId);

            if ($account == null) {
                $errors["msg"] = "This account does not exists";
                return $errors;
            } else if ($account->getDeletedAt() != null) {
                $errors["msg"] = "This account has been deleted";
                return $errors;
            }

            $account->setName($name);
            $account->setIssuer($issuer);
            $account->setDigits($digits);
            $account->setType($type);
            $account->setPeriod($period);
            $account->setAlgorithm($algorithm);
            if ($account->getCounter() == null) $account->setCounter(-1);
            $account->setUpdatedAt(date("Y-m-d H:i:s"));

            $this->accountMapper->update($account);

            return "OK";
        }
    }

    /**
     * @NoAdminRequired
     */
    public function delete(int $id): JSONResponse
    {
        $account = $this->accountMapper->find("id", $id, $this->userId);

        if ($account == null) return new JSONResponse(["error" => "There was an error while deleting your account"], 500);

        // delete shares
        $this->sharedAccountMapper->destroy($account);

        try {
            $this->accountMapper->safeDelete($account);
        } catch (Exception) {
            return new JSONResponse(["error" => "There was an error while deleting your account"], 500);
        }

        return new JSONResponse();
    }

    /**
     * @NoAdminRequired
     */
    public function import(array $data, string|null $passwordUsedOnExport, string $currentPassword): JSONResponse
    {
        if (!array_key_exists("accounts", $data)) return new JSONResponse(["error" => "Invalid JSON file"], 400);
        if (array_key_exists("iv", $data) && empty($passwordUsedOnExport)) return new JSONResponse(["error" => "Password is required to decrypt accounts"], 400);

        foreach ($data["accounts"] as $importedAccount) {
            if (array_key_exists("iv", $data)) {
                $importedAccount["secret"] = $this->encryption->decrypt($importedAccount["secret"], $passwordUsedOnExport, $data["iv"]);
                if ($importedAccount["secret"] === false) return new JSONResponse(["error" => "Password incorrect"], 400);
            }

            $importedAccount["secret"] = strtoupper($importedAccount["secret"]);
            $importedAccount["secret"] = $this->encryption->encrypt($importedAccount["secret"], $currentPassword, $this->userId, true);
            if ($importedAccount === false) return new JsonResponse([], 403);

            $this->create(
                $importedAccount["name"],
                $importedAccount["issuer"],
                $importedAccount["secret"],
                $importedAccount["type"],
                $importedAccount["period"],
                $importedAccount["algorithm"],
                $importedAccount["digits"],
                array_key_exists("counter", $importedAccount) ? $importedAccount["counter"] : null,
            );

        }

        return new JSONResponse();
    }
}

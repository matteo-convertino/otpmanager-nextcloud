<?php

declare(strict_types=1);

namespace OCA\OtpManager\Controller;

use OCA\OtpManager\Controller\Validator\SharedAccountForm;
use OCA\OtpManager\Db\AccountMapper;
use OCA\OtpManager\Db\SharedAccount;
use OCA\OtpManager\Db\SharedAccountMapper;
use OCA\OtpManager\Service\EncryptionService;
use OCP\AppFramework\Http;
use OCP\AppFramework\Http\Attribute\ApiRoute;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\Attribute\NoCSRFRequired;
use OCP\AppFramework\Http\JSONResponse;
use OCP\AppFramework\OCSController;
use OCP\IRequest;
use OCP\IUserManager;

class SharedAccountController extends OCSController
{
    private IUserManager $userManager;
    private SharedAccountMapper $sharedAccountMapper;
    private AccountMapper $accountMapper;
    private string $serverUrl;
    private ?string $userId;
    private EncryptionService $encryption;

    public function __construct(
        string              $AppName,
        IRequest            $request,
        IUserManager        $userManager,
        SharedAccountMapper $sharedAccountMapper,
        AccountMapper       $accountMapper,
        EncryptionService   $encryption,
        ?string             $UserId = null,
    )
    {
        parent::__construct($AppName, $request);
        $this->userManager = $userManager;
        $this->userId = $UserId;
        $this->sharedAccountMapper = $sharedAccountMapper;
        $this->accountMapper = $accountMapper;
        $this->encryption = $encryption;
        $this->serverUrl = $request->getServerProtocol() . "://" . $request->getServerHost() . "/";
    }

    #[NoAdminRequired]
    #[NoCSRFRequired]
    #[ApiRoute(verb: 'GET', url: '/share')]
    public function getByUser(): array
    {
        return $this->sharedAccountMapper->findAllByReceiverJoin($this->userId);
    }

    #[NoAdminRequired]
    #[NoCSRFRequired]
    #[ApiRoute(verb: 'GET', url: '/share/{id}')]
    public function getByAccount($id): array
    {
        $activeShares = $this->sharedAccountMapper->findAllByAccount($id);

        $result = [];

        foreach ($activeShares as $activeShare) {
            $receiver = $this->userManager->get($activeShare->getReceiverId());

            if (!is_null($receiver)) {
                $result[] = $activeShare->customJson($receiver, $this->serverUrl . "avatar/" . $receiver->getUID() . "/64");
            }
        }

        return $result;
    }

    #[NoAdminRequired]
    #[ApiRoute(verb: 'POST', url: '/share')]
    public function create(string $accountSecret, array $users, string $sharedSecret, string $password, string $iv, string | null $expirationDate): array|string
    {
        $errors = SharedAccountForm::validateCreate($accountSecret, $users, $sharedSecret, $password, $iv, $expirationDate);

        if (count($errors) > 0) {
            return $errors;
        } else {
            $account = $this->accountMapper->find("secret", $accountSecret, $this->userId);

            if (is_null($account)) {
                $errors["error"] = "The account to share does not exist";
                return $errors;
            } else if ($account->getUserId() != $this->userId) {
                $errors["error"] = "You cannot share an account that is not yours";
                return $errors;
            }

            foreach ($users as $receiverId) {
                $accountShared = $this->sharedAccountMapper->findByReceiver($account->getId(), $receiverId);

                if (is_null($accountShared)) {
                    $accountShared = new SharedAccount();

                    $maxSharedAccountPos = $this->sharedAccountMapper->findMaxPosition($receiverId);
                    $maxAccountPos = $this->accountMapper->findMaxPosition($receiverId);

                    $position = max($maxSharedAccountPos, $maxAccountPos) + 1;

                    $accountShared->setAccountId($account->getId());
                    $accountShared->setReceiverId($receiverId);
                    $accountShared->setName($account->getName());
                    $accountShared->setIssuer($account->getIssuer());
                    $accountShared->setSecret($sharedSecret);
                    $accountShared->setPassword(password_hash($password, PASSWORD_DEFAULT));
                    $accountShared->setIv($iv);
                    $accountShared->setIcon($account->getIcon());
                    $accountShared->setPosition($position);
                    $accountShared->setExpiredAt($expirationDate == null ? null : date('Y-m-d', strtotime($expirationDate)));
                    $accountShared->setCreatedAt(date("Y-m-d H:i:s"));
                    $accountShared->setUpdatedAt(date("Y-m-d H:i:s"));

                    $this->sharedAccountMapper->insert($accountShared);
                } else {
                    $accountShared->setExpiredAt($expirationDate == null ? null : date('Y-m-d', strtotime($expirationDate)));
                    $this->sharedAccountMapper->update($accountShared);
                }
            }

            return "OK";
        }
    }

    #[NoAdminRequired]
    #[ApiRoute(verb: 'PUT', url: '/share')]
    public function update(string $name, string $issuer, string $secret): array|string
    {
        $errors = SharedAccountForm::validateUpdate($name, $issuer, $secret);

        if (count($errors) > 0) {
            return $errors;
        } else {
            $sharedAccount = $this->sharedAccountMapper->find("secret", $secret, $this->userId);

            if ($sharedAccount == null) {
                $errors["msg"] = "This account does not exists";
                return $errors;
            }

            $sharedAccount->setName($name);
            $sharedAccount->setIssuer($issuer);

            $this->sharedAccountMapper->update($sharedAccount);

            return "OK";
        }
    }


    #[NoAdminRequired]
    #[ApiRoute(verb: 'DELETE', url: '/share/{accountId}')]
    public function delete(int $accountId): JSONResponse
    {
        $receiverId = $this->request->getParam("receiver");

        if ($this->sharedAccountMapper->unshare($accountId, $receiverId == null ? $this->userId : $receiverId)) {
            return new JSONResponse();
        }

        return new JSONResponse(["error" => "There was an error while deleting your shared account"], 500);
    }

    #[NoAdminRequired]
    #[NoCSRFRequired]
    #[ApiRoute(verb: 'GET', url: '/get-users/{accountId}')]
    public function getUsers($accountId): array
    {
        $result = $this->sharedAccountMapper->findUsers($this->userId, $accountId);

        $users = [];

        for ($i = 0; $i < count($result); $i++) {
            $user = $result[$i];

            $users[] = [
                "image" => $this->serverUrl . "avatar/" . $user["uid"] . "/64",
                "value" => $user["uid"],
                "label" => is_null($user["displayname"]) ? $user["uid"] : $user["displayname"],
            ];
        }

        return $users;
    }

    #[NoAdminRequired]
    #[ApiRoute(verb: 'POST', url: '/share/unlock')]
    public function unlock(int $accountId, string $currentPassword, string $tempPassword): JSONResponse
    {
        $accountShared = $this->sharedAccountMapper->findByReceiver($accountId, $this->userId);

        if ($accountShared == null)
            return new JSONResponse(["error" => "This shared account does not exists"], Http::STATUS_NOT_FOUND);

        if ($accountShared->getUnlocked())
            return new JSONResponse(null, Http::STATUS_OK);

        if (!password_verify(hash("sha256", $tempPassword), $accountShared->getPassword()))
            return new JSONResponse(["error" => "The password is incorrect"], Http::STATUS_BAD_REQUEST);

        $decryptedSecret = $this->encryption->decrypt($accountShared->getSecret(), $tempPassword, $accountShared->getIv());

        if ($decryptedSecret === false)
            return new JSONResponse(["error" => "There was an error while trying to decrypt the secret key"], Http::STATUS_BAD_REQUEST);

        $encryptedSecret = $this->encryption->encrypt($decryptedSecret, $currentPassword, $this->userId, true);

        if ($encryptedSecret === false)
            return new JSONResponse(["error" => "There was an error while trying to encrypt the secret key"], Http::STATUS_BAD_REQUEST);

        $accountShared->setSecret($encryptedSecret);
        $accountShared->setUnlocked(true);
        $this->sharedAccountMapper->update($accountShared);

        return new JSONResponse(null, Http::STATUS_OK);
    }

    #[NoAdminRequired]
    #[ApiRoute(verb: 'POST', url: '/share/update-counter')]
    public function updateCounter(string $secret): JSONResponse
    {
        $account = $this->sharedAccountMapper->findAccountBySecret($this->userId, $secret);

        if ($account == null) return new JSONResponse(["error" => "This account does not exists"], Http::STATUS_NOT_FOUND);
        if ($account->getType() == "totp") return new JSONResponse(["error" => "You cannot update counter of a TOTP account"], Http::STATUS_BAD_REQUEST);

        $account->setCounter($account->getCounter() + 1);
        $this->accountMapper->update($account);

        return new JSONResponse($account, Http::STATUS_OK);
    }
}

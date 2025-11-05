<?php

declare(strict_types=1);

namespace OCA\OtpManager\Controller;

use OCA\OtpManager\Controller\Validator\SharedAccountForm;
use OCA\OtpManager\Db\AccountMapper;
use OCA\OtpManager\Db\SharedAccount;
use OCA\OtpManager\Db\SharedAccountMapper;
use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\JSONResponse;
use OCP\IRequest;
use OCP\IUserManager;

class SharedAccountController extends Controller
{
    private IUserManager $userManager;
    private SharedAccountMapper $sharedAccountMapper;
    private AccountMapper $accountMapper;
    private $serverUrl;
    private ?string $userId;

    public function __construct(
        string              $AppName,
        IRequest            $request,
        IUserManager        $userManager,
        SharedAccountMapper $sharedAccountMapper,
        AccountMapper       $accountMapper,
        ?string             $UserId = null,
    )
    {
        parent::__construct($AppName, $request);
        $this->userManager = $userManager;
        $this->userId = $UserId;
        $this->sharedAccountMapper = $sharedAccountMapper;
        $this->accountMapper = $accountMapper;
        $this->serverUrl = $request->getServerProtocol() . "://" . $request->getServerHost() . "/";
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function getByUser(): array
    {
        return $this->sharedAccountMapper->findAllByReceiverJoin($this->userId);
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function getByAccount($id): array
    {
        $activeShares = $this->sharedAccountMapper->findAllByAccount($id);

        $result = [];

        foreach ($activeShares as &$activeShare) {
            $receiver = $this->userManager->get($activeShare->getReceiverId());

            if (!is_null($receiver)) {
                array_push($result, $activeShare->customJson($receiver, $this->serverUrl . "avatar/" . $receiver->getUID() . "/64"));
            }
        }

        return $result;
    }

    /**
     * @NoAdminRequired
     */
    public function create($data): array|string
    {
        $errors = SharedAccountForm::validateCreate($data);

        if (count($errors) > 0) {
            return $errors;
        } else {
            $account = $this->accountMapper->find("secret", $data["accountSecret"], $this->userId);

            if (is_null($account)) {
                $errors["error"] = "The account to share does not exist";
                return $errors;
            } else if ($account->getUserId() != $this->userId) {
                $errors["error"] = "You cannot share an account that is not yours";
                return $errors;
            }

            foreach ($data["users"] as $receiverId) {
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
                    $accountShared->setSecret($data["sharedSecret"]);
                    $accountShared->setPassword(password_hash($data["password"], PASSWORD_DEFAULT));
                    $accountShared->setIv($data["iv"]);
                    $accountShared->setIcon($account->getIcon());
                    $accountShared->setPosition($position);
                    $accountShared->setExpiredAt($data["expirationDate"] == null ? null : date('Y-m-d', strtotime($data["expirationDate"])));
                    $accountShared->setCreatedAt(date("Y-m-d H:i:s"));
                    $accountShared->setUpdatedAt(date("Y-m-d H:i:s"));

                    $this->sharedAccountMapper->insert($accountShared);
                } else {
                    $accountShared->setExpiredAt($data["expirationDate"] == null ? null : date('Y-m-d', strtotime($data["expirationDate"])));
                    $this->sharedAccountMapper->update($accountShared);
                }
            }

            return "OK";
        }
    }

    /**
     * @NoAdminRequired
     */
    public function update($data): array|string
    {
        $errors = SharedAccountForm::validateUpdate($data);

        if (count($errors) > 0) {
            return $errors;
        } else {
            $sharedAccount = $this->sharedAccountMapper->find("secret", $data["secret"], $this->userId);

            if ($sharedAccount == null) {
                $errors["msg"] = "This account does not exists";
                return $errors;
            }

            $sharedAccount->setName($data["name"]);
            $sharedAccount->setIssuer($data["issuer"]);

            $this->sharedAccountMapper->update($sharedAccount);

            return "OK";
        }
    }


    /**
     * @NoAdminRequired
     */
    public function delete(int $accountId): JSONResponse
    {
        $receiverId = $this->request->getParam("receiver");

        if ($this->sharedAccountMapper->unshare($accountId, $receiverId == null ? $this->userId : $receiverId)) {
            return new JSONResponse();
        }

        return new JSONResponse(["error" => "There was an error while deleting your shared account"], 500);
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
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
}

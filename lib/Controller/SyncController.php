<?php

declare(strict_types=1);

namespace OCA\OtpManager\Controller;

use OCA\OtpManager\Attribute\ValidateRequestBodyDTO;
use OCA\OtpManager\Dto\Request\Account\AccountCreateRequestDto;
use OCA\OtpManager\Dto\Request\Sync\AccountSyncRequestDto;
use OCA\OtpManager\Dto\Request\Sync\SharedAccountSyncRequestDto;
use OCA\OtpManager\Dto\Request\Sync\SyncUpdateRequestDto;
use OCA\OtpManager\Dto\Response\Sync\SyncResponseDto;
use OCA\OtpManager\Service\SyncService;
use OCP\AppFramework\Http\Attribute\ApiRoute;
use OCP\AppFramework\Http\Attribute\NoAdminRequired;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\OCS\OCSException;
use OCP\AppFramework\OCSController;
use OCP\IRequest;

class SyncController extends OCSController
{
    public function __construct(
        string                       $appName,
        IRequest                     $request,
        private readonly SyncService $syncService,
    )
    {
        parent::__construct($appName, $request);
    }

    /**
     * @param AccountSyncRequestDto[] $accounts
     * @param SharedAccountSyncRequestDto[] $sharedAccounts
     * @param string $appVersion
     * @return DataResponse<SyncResponseDto>
     * @throws OCSException
     */
    #[NoAdminRequired]
    #[ApiRoute(verb: 'POST', url: '/accounts/sync')]
    #[ValidateRequestBodyDTO(SyncUpdateRequestDto::class)]
    public function update(
        array  $accounts,
        array  $sharedAccounts,
        string $appVersion,
    ): DataResponse
    {
        return $this->syncService->update(
            new SyncUpdateRequestDto(
                accounts: array_map(
                    static fn(array $a) => AccountSyncRequestDto::fromArray($a),
                    $accounts
                ),
                sharedAccounts: array_map(
                    static fn(array $a) => SharedAccountSyncRequestDto::fromArray($a),
                    $sharedAccounts
                ),
                appVersion: $appVersion
            )
        );
    }
}

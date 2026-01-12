<?php

declare(strict_types=1);

namespace OCA\OtpManager\Dto\Request\Sync;

use JsonSerializable;
use OCA\OtpManager\AppInfo\Application;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Context\ExecutionContextInterface;

class SyncUpdateRequestDto implements JsonSerializable
{
    /**
     * @param AccountSyncRequestDto[] $accounts
     * @param SharedAccountSyncRequestDto[] $sharedAccounts
     */
    public function __construct(

        #[Assert\All([
            new Assert\Type(type: AccountSyncRequestDto::class, message: 'Each item must be a valid account'),
            new Assert\Valid,
        ])]
        public readonly array  $accounts,


        #[Assert\All([
            new Assert\Type(type: SharedAccountSyncRequestDto::class, message: 'Each item must be a valid shared account'),
            new Assert\Valid,
        ])]
        public readonly array  $sharedAccounts,

        #[Assert\Length(min: 1, minMessage: 'appVersion cannot be empty')]
        #[Assert\Regex(
            pattern: '/^\d+\.\d+\.\d+$/',
            message: 'appVersion must match the pattern x.y.z'
        )]
        public readonly string $appVersion,
    )
    {
    }

    #[Assert\Callback]
    public function validateVersion(ExecutionContextInterface $context): void
    {
        if (version_compare($this->appVersion, Application::MIN_MOBILE_VERSION, '<')) {
            $context->buildViolation('Please update mobile app to the latest version')
                ->atPath('appVersion')
                ->addViolation();
        }
    }

    public function jsonSerialize(): array
    {
        return [
            'accounts' => $this->accounts,
            'sharedAccounts' => $this->sharedAccounts,
            'appVersion' => $this->appVersion
        ];
    }
}
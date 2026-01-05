<?php

declare(strict_types=1);

namespace OCA\OtpManager\AppInfo;

use OCA\OtpManager\Middleware\ExceptionHandler;
use OCA\OtpManager\Middleware\RequestBodyValidator;
use OCP\AppFramework\App;
use OCP\AppFramework\Bootstrap\IBootContext;
use OCP\AppFramework\Bootstrap\IBootstrap;
use OCP\AppFramework\Bootstrap\IRegistrationContext;

class Application extends App implements IBootstrap
{
    public const APP_ID = 'otpmanager';
    public const ACCOUNTS_DB = 'otpmanager_accounts';
    public const SETTINGS_DB = 'otpmanager_settings';
    public const SHARED_ACCOUNTS_DB = 'otpmanager_shared';

    public function __construct()
    {
        parent::__construct(self::APP_ID);
    }


    public function register(IRegistrationContext $context): void
    {
        include_once __DIR__ . '/../../vendor/autoload.php';

        $context->registerMiddleware(ExceptionHandler::class);
        $context->registerMiddleware(RequestBodyValidator::class);
    }

    public function boot(IBootContext $context): void
    {
    }
}

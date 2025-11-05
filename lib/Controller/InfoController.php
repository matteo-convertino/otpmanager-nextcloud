<?php

declare(strict_types=1);

namespace OCA\OtpManager\Controller;

use OCP\App\IAppManager;
use OCP\AppFramework\Controller;
use OCP\IRequest;


class InfoController extends Controller
{
    private IAppManager $appManager;

    public function __construct(
        string      $AppName,
        IRequest    $request,
        IAppManager $appManager,
    )
    {
        parent::__construct($AppName, $request);
        $this->appManager = $appManager;
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function get(): string
    {
        return $this->appManager->getAppVersion($this->appName, useCache: false);
    }
}

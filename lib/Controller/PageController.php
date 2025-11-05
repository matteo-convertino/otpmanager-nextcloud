<?php

declare(strict_types=1);

namespace OCA\OtpManager\Controller;

use OCP\AppFramework\Controller;
use OCP\AppFramework\Http\TemplateResponse;
use OCP\IRequest;
use OCP\Util;

class PageController extends Controller
{

    public function __construct(string $AppName, IRequest $request)
    {
        parent::__construct($AppName, $request);
    }

    /**
     * @NoAdminRequired
     * @NoCSRFRequired
     */
    public function index(): TemplateResponse
    {
        Util::addScript($this->appName, 'otpmanager-main');

        //throw new \Exception(print_r($accounts));
        return new TemplateResponse($this->appName, 'main');
    }
}

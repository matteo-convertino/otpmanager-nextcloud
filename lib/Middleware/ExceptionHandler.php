<?php

namespace OCA\OtpManager\Middleware;

use OCP\AppFramework\Middleware;
use Psr\Log\LoggerInterface;

class ExceptionHandler extends Middleware
{


    public function __construct(/*private readonly LoggerInterface $logger*/)
    {
    }

//    public function afterException(Controller $controller, string $methodName, Exception $exception): void
//    {
//        $this->logger->warning($exception->getMessage());
//        parent::afterException($controller, $methodName, $exception);
//    }
}
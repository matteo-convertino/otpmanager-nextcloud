<?php

declare(strict_types=1);

namespace OCA\OtpManager\Attribute;

#[\Attribute(\Attribute::TARGET_METHOD)]
final class ValidateRequestBodyDTO {
    public function __construct(public string $dtoClass) {}
}

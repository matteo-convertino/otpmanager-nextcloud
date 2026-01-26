<?php

declare(strict_types=1);

namespace OCA\OtpManager\Attribute;

#[\Attribute(\Attribute::TARGET_PARAMETER | \Attribute::TARGET_PROPERTY)]
final class ValidateArrayOfDto {
    public function __construct(public string $dtoClass) {}
}

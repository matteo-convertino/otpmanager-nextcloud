<?php

declare(strict_types=1);

namespace OCA\OtpManager\Dto\Response;

use JsonSerializable;

final class ReceiverResponseDto implements JsonSerializable
{
    public function __construct(
        public readonly string $id,
        public readonly ?string $label = null,
        public readonly ?string $value = null,
        public readonly ?string $image = null
    )
    {
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'label' => $this->label,
            'value' => $this->value,
            'image' => $this->image
        ];
    }
}
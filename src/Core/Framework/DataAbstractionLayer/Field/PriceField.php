<?php declare(strict_types=1);

namespace Shopware\Core\Framework\DataAbstractionLayer\Field;

use Shopware\Core\Framework\Log\Package;
use Shopware\Core\Framework\DataAbstractionLayer\Dbal\FieldAccessorBuilder\PriceFieldAccessorBuilder;
use Shopware\Core\Framework\DataAbstractionLayer\FieldSerializer\PriceFieldSerializer;

/**
 * @package core
 */
#[Package('core')]
class PriceField extends JsonField
{
    public function __construct(string $storageName, string $propertyName)
    {
        parent::__construct($storageName, $propertyName);
    }

    protected function getSerializerClass(): string
    {
        return PriceFieldSerializer::class;
    }

    protected function getAccessorBuilderClass(): ?string
    {
        return PriceFieldAccessorBuilder::class;
    }
}

<?php declare(strict_types=1);

namespace Shopware\Core\System\CustomField;

use Shopware\Core\Framework\Log\Package;
use Shopware\Core\Framework\DataAbstractionLayer\EntityCollection;

/**
 * @package core
 * @extends EntityCollection<CustomFieldEntity>
 */
#[Package('core')]
class CustomFieldCollection extends EntityCollection
{
    public function filterByType(string $type): self
    {
        return $this->filter(function (CustomFieldEntity $attribute) use ($type) {
            return $attribute->getType() === $type;
        });
    }

    public function getApiAlias(): string
    {
        return 'custom_field_collection';
    }

    protected function getExpectedClass(): string
    {
        return CustomFieldEntity::class;
    }
}

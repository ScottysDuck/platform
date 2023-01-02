<?php declare(strict_types=1);

namespace Shopware\Core\Framework\App\Aggregate\FlowActionTranslation;

use Shopware\Core\Framework\Log\Package;
use Shopware\Core\Framework\DataAbstractionLayer\EntityCollection;

/**
 * @extends EntityCollection<AppFlowActionTranslationEntity>
 * @package core
 */
#[Package('core')]
class AppFlowActionTranslationCollection extends EntityCollection
{
    protected function getExpectedClass(): string
    {
        return AppFlowActionTranslationEntity::class;
    }
}

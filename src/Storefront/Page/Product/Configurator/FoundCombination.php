<?php declare(strict_types=1);

namespace Shopware\Storefront\Page\Product\Configurator;

use Shopware\Core\Framework\Log\Package;
use Shopware\Core\Content\Product\SalesChannel\FindVariant\FoundCombination as CoreFoundCombination;

/**
 * @deprecated tag:v6.5.0 - Class will be removed, use \Shopware\Core\Content\Product\SalesChannel\FindVariant\FoundCombination instead
 * @package inventory
 */
#[Package('inventory')]
class FoundCombination extends CoreFoundCombination
{
}

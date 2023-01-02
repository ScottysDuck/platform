<?php declare(strict_types=1);

namespace Shopware\Core\Checkout\Shipping\Event;

use Shopware\Core\Framework\Log\Package;
use Shopware\Core\Framework\Adapter\Cache\StoreApiRouteCacheKeyEvent;

/**
 * @package checkout
 */
#[Package('checkout')]
class ShippingMethodRouteCacheKeyEvent extends StoreApiRouteCacheKeyEvent
{
}

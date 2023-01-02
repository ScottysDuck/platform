<?php declare(strict_types=1);

namespace Shopware\Core\Checkout\Promotion\Service;

use Shopware\Core\Framework\Log\Package;
/**
 * @package checkout
 */
#[Package('checkout')]
interface PromotionDateTimeServiceInterface
{
    public function getNow(): string;
}

<?php declare(strict_types=1);

namespace Shopware\Core\System\SalesChannel\Aggregate\SalesChannelDomain;

use Shopware\Core\Framework\Log\Package;
use Shopware\Core\Framework\DataAbstractionLayer\EntityCollection;

/**
 * @package sales-channel
 *
 * @extends EntityCollection<SalesChannelDomainEntity>
 */
#[Package('sales-channel')]
class SalesChannelDomainCollection extends EntityCollection
{
    public function getApiAlias(): string
    {
        return 'sales_channel_domain_collection';
    }

    protected function getExpectedClass(): string
    {
        return SalesChannelDomainEntity::class;
    }
}

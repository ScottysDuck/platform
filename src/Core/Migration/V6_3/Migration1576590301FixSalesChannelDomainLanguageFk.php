<?php declare(strict_types=1);

namespace Shopware\Core\Migration\V6_3;

use Shopware\Core\Framework\Log\Package;
use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

/**
 * @deprecated tag:v6.5.0 - reason:becomes-internal - Migrations will be internal in v6.5.0
 * @package core
 */
#[Package('core')]
class Migration1576590301FixSalesChannelDomainLanguageFk extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1576590301;
    }

    public function update(Connection $connection): void
    {
        $connection->executeStatement('
            ALTER TABLE `sales_channel_domain`
            DROP FOREIGN KEY `fk.sales_channel_domain.language_id`;
        ');

        // Remove SalesChannelFk too, because it somehow relies on the same index as the wrong FK
        $connection->executeStatement('
            ALTER TABLE `sales_channel_domain`
            DROP FOREIGN KEY `fk.sales_channel_domain.sales_channel_id`;
        ');

        $connection->executeStatement('
            ALTER TABLE `sales_channel_domain`
            DROP INDEX `fk.sales_channel_domain.language_id`;
        ');

        $connection->executeStatement('
            ALTER TABLE `sales_channel_domain`
            ADD CONSTRAINT `fk.sales_channel_domain.language_id` FOREIGN KEY (language_id)
              REFERENCES `language` (id) ON DELETE RESTRICT ON UPDATE CASCADE;
        ');

        $connection->executeStatement('
            ALTER TABLE `sales_channel_domain`
            ADD CONSTRAINT `fk.sales_channel_domain.sales_channel_id` FOREIGN KEY (sales_channel_id)
              REFERENCES `sales_channel` (id) ON DELETE CASCADE ON UPDATE CASCADE;
        ');
    }

    public function updateDestructive(Connection $connection): void
    {
        // implement update destructive
    }
}

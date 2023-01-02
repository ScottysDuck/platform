<?php declare(strict_types=1);

namespace Shopware\Core\Migration\V6_4;

use Shopware\Core\Framework\Log\Package;
use Doctrine\DBAL\Connection;
use Shopware\Core\Framework\Migration\MigrationStep;

/**
 * @package core
 *
 * @deprecated tag:v6.5.0 - reason:becomes-internal - Migrations will be internal in v6.5.0
 */
#[Package('core')]
class Migration1629204538AddTimeZoneField extends MigrationStep
{
    public function getCreationTimestamp(): int
    {
        return 1629204538;
    }

    public function update(Connection $connection): void
    {
        $connection->executeStatement('ALTER TABLE `user` ADD `time_zone` varchar(255) NOT NULL DEFAULT \'UTC\' AFTER `last_updated_password_at`;');
    }

    public function updateDestructive(Connection $connection): void
    {
    }
}

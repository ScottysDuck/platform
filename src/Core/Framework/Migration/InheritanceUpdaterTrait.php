<?php declare(strict_types=1);

namespace Shopware\Core\Framework\Migration;

use Shopware\Core\Framework\Log\Package;
use Doctrine\DBAL\Connection;

/**
 * @package core
 */
#[Package('core')]
trait InheritanceUpdaterTrait
{
    protected function updateInheritance(Connection $connection, string $entity, string $propertyName): void
    {
        $sql = str_replace(
            ['#table#', '#column#'],
            [$entity, $propertyName],
            'ALTER TABLE `#table#` ADD COLUMN `#column#` binary(16) NULL'
        );

        $connection->executeStatement($sql);
    }
}

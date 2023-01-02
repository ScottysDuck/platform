<?php declare(strict_types=1);

namespace Shopware\Elasticsearch\Framework;

use Shopware\Core\Framework\Log\Package;
use Elasticsearch\Client;
use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepositoryInterface;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\System\Language\LanguageCollection;

/**
 * @package core
 */
#[Package('core')]
class ElasticsearchOutdatedIndexDetector
{
    private Client $client;

    private ElasticsearchRegistry $registry;

    private EntityRepositoryInterface $languageRepository;

    private ElasticsearchHelper $helper;

    /**
     * @internal
     */
    public function __construct(
        Client $client,
        ElasticsearchRegistry $esRegistry,
        EntityRepositoryInterface $languageRepository,
        ElasticsearchHelper $helper
    ) {
        $this->client = $client;
        $this->registry = $esRegistry;
        $this->languageRepository = $languageRepository;
        $this->helper = $helper;
    }

    /**
     * @return array<string>
     */
    public function get(): ?array
    {
        $allIndices = $this->getAllIndices();

        if (empty($allIndices)) {
            return [];
        }

        $indicesToBeDeleted = [];
        foreach ($allIndices as $index) {
            if (\count($index['aliases']) > 0) {
                continue;
            }

            $indicesToBeDeleted[] = $index['settings']['index']['provided_name'];
        }

        return $indicesToBeDeleted;
    }

    /**
     * @return array<string>
     */
    public function getAllUsedIndices(): array
    {
        $allIndices = $this->getAllIndices();

        return array_map(function (array $index) {
            return $index['settings']['index']['provided_name'];
        }, $allIndices);
    }

    private function getLanguages(): LanguageCollection
    {
        /** @var LanguageCollection $entities */
        $entities = $this->languageRepository
            ->search(new Criteria(), Context::createDefaultContext())
            ->getEntities();

        return $entities;
    }

    /**
     * @return array<string>
     */
    private function getPrefixes(): array
    {
        $definitions = $this->registry->getDefinitions();

        /** @var LanguageCollection $languages */
        $languages = $this->getLanguages();

        $prefixes = [];
        foreach ($languages as $language) {
            foreach ($definitions as $definition) {
                $prefixes[] = sprintf('%s_*', $this->helper->getIndexName($definition->getEntityDefinition(), $language->getId()));
            }
        }

        return $prefixes;
    }

    /**
     * @return array{aliases: array<string>, settings: array<mixed>}[]
     */
    private function getAllIndices(): array
    {
        $prefixes = array_chunk($this->getPrefixes(), 5);

        $allIndices = [];

        foreach ($prefixes as $prefix) {
            $indices = $this->client->indices()->get(
                ['index' => implode(',', $prefix)]
            );

            $allIndices = array_merge($allIndices, $indices);
        }

        return $allIndices;
    }
}

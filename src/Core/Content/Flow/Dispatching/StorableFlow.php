<?php declare(strict_types=1);

namespace Shopware\Core\Content\Flow\Dispatching;

use Shopware\Core\Content\Flow\FlowException;
use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\Log\Package;

/**
 * @final
 */
#[Package('business-ops')]
class StorableFlow
{
    private ?FlowState $state = null;

    /**
     * @var array<string, mixed>
     */
    private array $config = [];

    /**
     * @internal
     *
     * @param array<string, mixed> $store
     * @param array<string, mixed> $data
     */
    public function __construct(
        protected string $name,
        protected Context $context,
        protected array $store = [],
        protected array $data = []
    ) {
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getContext(): Context
    {
        return $this->context;
    }

    public function setStore(string $key, mixed $value): void
    {
        $this->store[$key] = $value;
    }

    public function hasStore(string $key): bool
    {
        return \array_key_exists($key, $this->store);
    }

    /**
     * @return mixed
     */
    public function getStore(string $key, mixed $default = null)
    {
        return $this->store[$key] ?? $default;
    }

    /**
     * @return array<string, mixed>
     */
    public function stored(): array
    {
        return $this->store;
    }

    public function setData(string $key, mixed $value): void
    {
        $this->data[$key] = $value;
    }

    public function hasData(string $key): bool
    {
        return \array_key_exists($key, $this->data);
    }

    /**
     * @return mixed
     */
    public function getData(string $key, mixed $default = null)
    {
        $value = $this->data[$key] ?? $default;

        if (\is_callable($value)) {
            $this->data[$key] = $value($this);
        }

        return $this->data[$key] ?? $default;
    }

    /**
     * @return array<string, mixed>
     */
    public function data(): array
    {
        foreach ($this->data as $key => $data) {
            $this->getData($key);
        }

        return $this->data;
    }

    /**
     * @param array<int, mixed> $args
     */
    public function lazy(string $key, callable $closure, array $args): void
    {
        $this->data[$key] = $closure($args);
    }

    /**
     * @param array<string, mixed> $config
     */
    public function setConfig(array $config): void
    {
        $this->config = $config;
    }

    /**
     * @return array<string, mixed>
     */
    public function getConfig(): array
    {
        return $this->config;
    }

    public function setFlowState(FlowState $state): void
    {
        $this->state = $state;
    }

    public function getFlowState(): FlowState
    {
        if (!$this->state) {
            throw FlowException::methodNotCompatible('getFlowState()', self::class);
        }

        return $this->state;
    }

    public function stop(): void
    {
        if (!$this->state) {
            throw FlowException::methodNotCompatible('stop()', self::class);
        }

        $this->state->stop = true;
    }
}

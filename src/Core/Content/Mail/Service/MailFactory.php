<?php declare(strict_types=1);

namespace Shopware\Core\Content\Mail\Service;

use Shopware\Core\Framework\Log\Package;
use Shopware\Core\Framework\DataAbstractionLayer\Write\Validation\ConstraintBuilder;
use Shopware\Core\Framework\Feature;
use Shopware\Core\Framework\Plugin\Exception\DecorationPatternException;
use Shopware\Core\Framework\Validation\Exception\ConstraintViolationException;
use Symfony\Component\Mime\Email;
use Symfony\Component\Validator\ConstraintViolationList;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * @package system-settings
 */
#[Package('system-settings')]
class MailFactory extends AbstractMailFactory
{
    /**
     * @var ValidatorInterface
     */
    private $validator;

    /**
     * @internal
     */
    public function __construct(ValidatorInterface $validator)
    {
        $this->validator = $validator;
    }

    /**
     * @param string[] $sender
     * @param string[] $recipients
     * @param string[] $contents
     * @param string[] $attachments
     * @param mixed[] $additionalData
     * @param array<int, mixed[]>|null $binAttachments
     */
    public function create(
        string $subject,
        array $sender,
        array $recipients,
        array $contents,
        array $attachments,
        array $additionalData,
        ?array $binAttachments = null
    ): Email {
        $this->assertValidAddresses(array_keys($recipients));

        $mail = (new Mail())
            ->subject($subject)
            ->from(...$this->formatMailAddresses($sender))
            ->to(...$this->formatMailAddresses($recipients))
            ->setMailAttachmentsConfig($additionalData['attachmentsConfig'] ?? null);

        foreach ($contents as $contentType => $data) {
            if ($contentType === 'text/html') {
                $mail->html($data);
            } else {
                $mail->text($data);
            }
        }

        $attach = Feature::isActive('v6.5.0.0') ? 'attach' : 'embed';

        foreach ($attachments as $url) {
            $mail->addAttachmentUrl($url);
        }

        if (isset($binAttachments)) {
            foreach ($binAttachments as $binAttachment) {
                $mail->$attach(
                    $binAttachment['content'],
                    $binAttachment['fileName'],
                    $binAttachment['mimeType']
                );
            }
        }

        foreach ($additionalData as $key => $value) {
            switch ($key) {
                case 'recipientsCc':
                    $mail->addCc(...$this->formatMailAddresses([$value => $value]));

                    break;
                case 'recipientsBcc':
                    $mail->addBcc(...$this->formatMailAddresses([$value => $value]));

                    break;
                case 'replyTo':
                    $mail->addReplyTo(...$this->formatMailAddresses([$value => $value]));

                    break;
                case 'returnPath':
                    $mail->returnPath(...$this->formatMailAddresses([$value => $value]));
            }
        }

        return $mail;
    }

    public function getDecorated(): AbstractMailFactory
    {
        throw new DecorationPatternException(self::class);
    }

    /**
     * @param string[] $addresses
     *
     * @throws ConstraintViolationException
     */
    private function assertValidAddresses(array $addresses): void
    {
        $constraints = (new ConstraintBuilder())
            ->isNotBlank()
            ->isEmail()
            ->getConstraints();

        $violations = new ConstraintViolationList();
        foreach ($addresses as $address) {
            $violations->addAll($this->validator->validate($address, $constraints));
        }

        if ($violations->count() > 0) {
            throw new ConstraintViolationException($violations, $addresses);
        }
    }

    /**
     * @param string[] $addresses
     *
     * @return string[]
     */
    private function formatMailAddresses(array $addresses): array
    {
        $formattedAddresses = [];
        foreach ($addresses as $mail => $name) {
            $formattedAddresses[] = $name . ' <' . $mail . '>';
        }

        return $formattedAddresses;
    }
}

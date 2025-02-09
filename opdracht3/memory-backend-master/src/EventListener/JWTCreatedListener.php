<?php
namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\HttpFoundation\RequestStack;

class JWTCreatedListener {
    private RequestStack $requestStack;

    public function __construct(RequestStack $requestStack)
    {
        $this->requestStack = $requestStack;
    }

    public function onJWTCreated(JWTCreatedEvent $event)
    {
        $user = $event->getUser(); // Haal de gebruiker op
        if (!method_exists($user, 'getId')) {
            throw new \RuntimeException('De methode getId() bestaat niet in de Player entity.');
        }

        $payload = $event->getData();
        $payload['sub'] = $user->getId(); // ✅ Gebruik de getter
        $payload['iss'] = 'memory backend';

        $event->setData($payload);

        // Voeg extra info toe aan de header (voor backward compatibility)
        $header = $event->getHeader();
        $header['sub'] = $user->getId(); // ✅ Gebruik de getter
        $header['iss'] = 'memory backend';

        $event->setHeader($header);
    }
}

<?php

namespace App\Controller;

use App\Entity\Player;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route("/api/player")]
class PlayerController extends AbstractController {

    #[Route('/preferences', methods: ['GET', 'POST'])]
    public function getPlayerPreferences(Request $request, ManagerRegistry $doctrine): JsonResponse {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(["error" => "Niet ingelogd"], 401);
        }

        $em = $doctrine->getManager();

        if ($request->getMethod() === 'POST') {
            $params = json_decode($request->getContent(), true);
            if (isset($params['api'])) $user->setPreferredApi($params['api']);
            if (isset($params['color_found'])) $user->setPreferredColorFound($params['color_found']);
            if (isset($params['color_closed'])) $user->setPreferredColorClosed($params['color_closed']);

            $em->persist($user);
            $em->flush();

            return new JsonResponse(["message" => "Voorkeuren opgeslagen!"], 204);
        }

        return new JsonResponse([
            "preferred_api" => $user->getPreferredApi(),
            "color_found" => $user->getPreferredColorFound(),
            "color_closed" => $user->getPreferredColorClosed()
        ]);
    }

    #[Route('/email', methods: ['GET', 'PUT'])]
    public function playerEmail(Request $request, ManagerRegistry $doctrine): JsonResponse {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(["error" => "Niet ingelogd"], 401);
        }

        $em = $doctrine->getManager();

        if ($request->getMethod() === 'PUT') {
            $params = json_decode($request->getContent(), true);
            if (isset($params['email']) && filter_var($params['email'], FILTER_VALIDATE_EMAIL)) {
                $user->setEmail($params['email']);
                $em->persist($user);
                $em->flush();
                return new JsonResponse(["message" => "E-mail geüpdatet!"], 204);
            }
            return new JsonResponse(["error" => "Geen geldige e-mail opgegeven"], 400);
        }

        return new JsonResponse(["email" => $user->getEmail()]);
    }

    #[Route('/', methods: ['GET'])]
    public function getUserData(): JsonResponse {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(["error" => "Niet ingelogd"], 401);
        }
        return new JsonResponse([
            "id" => $user->getId(),
            "name" => $user->getUsername(),
            "email" => $user->getEmail()
        ]);
    }

    #[Route('/logout', methods: ['POST'])]
    public function logout(): JsonResponse {
        return new JsonResponse(["message" => "Uitgelogd! Token wordt client-side verwijderd."], 200);
    }
}

<?php

namespace App\Controller;

use App\Entity\Player;
use Doctrine\Persistence\ManagerRegistry;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;

class DefaultController extends AbstractController {
    #[Route('/', methods:['GET'])]
    public function index(LoggerInterface $logger):Response {
//        $logger->info("Hallo allemaal");dd
        return new Response('DefaultController');
    }

    #[Route('/frontend', methods:['GET'])]
    public function demo():Response {
        $rv['message'] = 'Welkom bij de memory backend api.';
        $rv['date'] = date("F j, Y, g:i a");
        return new JsonResponse($rv);
    }

    #[Route('/api/login_check', methods:['POST'])]
    public function login():Response {
        return new Response('');
    }

    #[Route('/scores', methods: ['GET'])]
    public function scores(ManagerRegistry $doctrine)
    {
        $em = $doctrine->getManager();
        $scores = $em->createQuery("select p.username, avg(g.score) as score from App\Entity\Player p 
                    join p.games g group by p.username")->getArrayResult();
        return new JsonResponse($scores);
    }

#[Route('/register', methods: ['POST'])]
public function register(ManagerRegistry $doctrine, Request $request): Response {
    try {
        $params = json_decode($request->getContent(), true);

        if (!isset($params['username'], $params['email'], $params['password'])) {
            return new JsonResponse(["error" => "Vul alle velden in"], 400);
        }

        $em = $doctrine->getManager();

        // Controleer of de gebruikersnaam of e-mail al bestaat
        if ($em->getRepository(Player::class)->findOneBy(['username' => $params['username']])) {
            return new JsonResponse(["error" => "Gebruikersnaam bestaat al"], 400);
        }

        if ($em->getRepository(Player::class)->findOneBy(['email' => $params['email']])) {
            return new JsonResponse(["error" => "E-mail is al in gebruik"], 400);
        }

        // Wachtwoord hashen en opslaan
        $hashedPassword = password_hash($params['password'], PASSWORD_DEFAULT);
        $player = new Player($params['username'], $params['email'], $hashedPassword);

        $em->persist($player);
        $em->flush();

        return new JsonResponse(["message" => "Speler geregistreerd!", "id" => $player->getId()], 201);
    } catch (\Exception $e) {
        return new JsonResponse(["error" => $e->getMessage()], 400);
    }
}


}

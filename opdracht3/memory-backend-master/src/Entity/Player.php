<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity]
#[ApiResource]
class Player implements \JsonSerializable, UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private int $id;

    #[ORM\Column(name: "name", unique: true)]
    private string $username;

    #[ORM\Column(type: "string", unique: true)]
    private string $email;

    #[ORM\Column(type: "string")]
    private string $password_hash;

    #[ORM\Column(nullable: true)]
    private ?string $preferred_api = null;

    #[ORM\Column(nullable: true)]
    private ?string $preferred_color_closed = null;

    #[ORM\Column(nullable: true)]
    private ?string $preferred_color_found = null;

    #[ORM\ManyToMany(targetEntity: Game::class, cascade: ["persist"])]
    #[ORM\JoinTable(name: "player_games")]
    #[ORM\JoinColumn(name: "player_id", referencedColumnName: "id")]
    #[ORM\InverseJoinColumn(name: "game_id", referencedColumnName: "id", unique: true)]
    private Collection $games;

    public function __construct(string $username, string $email, string $password_hash)
    {
        $this->username = $username;
        $this->email = $email;
        $this->password_hash = $password_hash;
        $this->games = new ArrayCollection();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getUsername(): string
    {
        return $this->username;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): void
    {
        $this->email = $email;
    }

    public function getPassword(): ?string
    {
        return $this->password_hash;
    }

    public function getRoles(): array
    {
        $roles = ['ROLE_USER'];
        if ($this->username === 'Henk') {
            $roles[] = 'ROLE_ADMIN';
        }
        return $roles;
    }

    public function eraseCredentials()
    {
        // Niet nodig voor dit project, maar verplicht door UserInterface
    }

    public function getUserIdentifier(): string
    {
        return $this->username;
    }

    public function getPreferredApi(): ?string
    {
        return $this->preferred_api;
    }

    public function setPreferredApi(?string $api): void
    {
        $this->preferred_api = $api;
    }

    public function getPreferredColorFound(): ?string
    {
        return $this->preferred_color_found;
    }

    public function setPreferredColorFound(?string $color): void
    {
        $this->preferred_color_found = $color;
    }

    public function getPreferredColorClosed(): ?string
    {
        return $this->preferred_color_closed;
    }

    public function setPreferredColorClosed(?string $color): void
    {
        $this->preferred_color_closed = $color;
    }

    public function jsonSerialize(): mixed
    {
        return [
            'id' => $this->id,
            'name' => $this->username,
            'email' => $this->email,
            'preferred_api' => $this->preferred_api,
            'color_found' => $this->preferred_color_found,
            'color_closed' => $this->preferred_color_closed,
            'games' => $this->games->toArray(),
        ];
    }
}

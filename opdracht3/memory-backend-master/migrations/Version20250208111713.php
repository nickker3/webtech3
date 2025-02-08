<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250208111713 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE game (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, date DATETIME NOT NULL, score DOUBLE PRECISION NOT NULL, api VARCHAR(255) DEFAULT NULL, color_closed VARCHAR(255) DEFAULT NULL, color_found VARCHAR(255) DEFAULT NULL)');
        $this->addSql('CREATE TABLE player (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, password_hash VARCHAR(255) NOT NULL, preferred_api VARCHAR(255) DEFAULT NULL, preferred_color_closed VARCHAR(255) DEFAULT NULL, preferred_color_found VARCHAR(255) DEFAULT NULL)');
        $this->addSql('CREATE TABLE player_games (player_id INTEGER NOT NULL, game_id INTEGER NOT NULL, PRIMARY KEY(player_id, game_id), CONSTRAINT FK_4051507799E6F5DF FOREIGN KEY (player_id) REFERENCES player (id) NOT DEFERRABLE INITIALLY IMMEDIATE, CONSTRAINT FK_40515077E48FD905 FOREIGN KEY (game_id) REFERENCES game (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('CREATE INDEX IDX_4051507799E6F5DF ON player_games (player_id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_40515077E48FD905 ON player_games (game_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE game');
        $this->addSql('DROP TABLE player');
        $this->addSql('DROP TABLE player_games');
    }
}

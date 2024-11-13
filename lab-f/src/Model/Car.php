<?php
namespace App\Model;

use App\Service\Config;

class Car
{
    private ?int $id = null;
    private ?string $carBrand = null;
    private ?string $model = null;
    private ?int $year = null;
    private ?string $description = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Car
    {
        $this->id = $id;
        return $this;
    }

    public function getCarBrand(): ?string
    {
        return $this->carBrand;
    }

    public function setCarBrand(?string $carBrand): Car
    {
        $this->carBrand = $carBrand;
        return $this;
    }

    public function getModel(): ?string
    {
        return $this->model;
    }

    public function setModel(?string $model): Car
    {
        $this->model = $model;
        return $this;
    }

    public function getYear(): ?int
    {
        return $this->year;
    }

    public function setYear(?int $year): Car
    {
        $this->year = $year;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): Car
    {
        $this->description = $description;
        return $this;
    }

    public static function fromArray($array): Car
    {
        $car = new self();
        $car->fill($array);
        return $car;
    }

    public function fill($array): Car
    {
        if (isset($array['id']) && !$this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['carBrand'])) {
            $this->setCarBrand($array['carBrand']);
        }
        if (isset($array['model'])) {
            $this->setModel($array['model']);
        }
        if (isset($array['year'])) {
            $this->setYear($array['year']);
        }
        if (isset($array['description'])) {
            $this->setDescription($array['description']);
        }
        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM car';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $cars = [];
        foreach ($statement->fetchAll(\PDO::FETCH_ASSOC) as $carArray) {
            $cars[] = self::fromArray($carArray);
        }
        return $cars;
    }

    public static function find($id): ?Car
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM car WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $carArray = $statement->fetch(\PDO::FETCH_ASSOC);
        return $carArray ? self::fromArray($carArray) : null;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (!$this->getId()) {
            $sql = "INSERT INTO car (carBrand, model, year, description) VALUES (:carBrand, :model, :year, :description)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'carBrand' => $this->getCarBrand(),
                'model' => $this->getModel(),
                'year' => $this->getYear(),
                'description' => $this->getDescription(),
            ]);
            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE car SET carBrand = :carBrand, model = :model, year = :year, description = :description WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':carBrand' => $this->getCarBrand(),
                ':model' => $this->getModel(),
                ':year' => $this->getYear(),
                ':description' => $this->getDescription(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM car WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([':id' => $this->getId()]);

        $this->setId(null);
        $this->setCarBrand(null);
        $this->setModel(null);
        $this->setYear(null);
        $this->setDescription(null);
    }
}
